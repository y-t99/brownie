When building a request-response monolith backed by a single database that supports transactions, we don’t have many distributed systems concerns. We can have simple failure modes and easily maintain accurate state:

- If the client can’t reach the server, the client retries.
- If the client reaches the server, but the server can’t reach the database, the server responds with an error, and the client retries.
- If the server reaches the database, but the transaction fails, the server responds with an error, and the client retries.
- If the transaction succeeds but the server goes down before responding to the client, the client retries until the server is back up, and the transaction fails the second time (assuming the transaction has some check–like an idempotency token–to tell whether the update has already been applied), and the server reports to the client that the action has already been performed.

As soon as we introduce a second place for state to live, whether that’s a service with its own database or an external API, handling failures and maintaining consistency (accuracy across all data stores) gets significantly more complex. For example, if our server has to charge a credit card and also update the database, we can no longer write simple code like:

```typescript
function handleRequest() {
  paymentAPI.chargeCard()
  database.insertOrder()
  return 200
}
```

If the first step (charging the card) succeeds, but the second step (adding the order to the database) fails, then the system ends up in an inconsistent state; we charged their card, but there’s no record of it in our database. To try to maintain consistency, we might have the second step retry until we can reach the database. However, it’s also possible that the process running our code will fail, in which case we’ll have no knowledge that the first step took place. To fix this, we need to do three things:

- Persist the order details
- Persist which steps of the program we’ve completed
- Run a worker process that checks the database for incomplete orders and continues with the next step

That, along with persisting retry state and adding timeouts for each step, is a lot of code to write, and it’s easy to miss certain edge cases or failure modes (see the full, scalable architecture). We could build things faster and more reliably if we didn’t have to write and debug all that code. And we don’t have to, because we can use durable execution.

## Durable execution

Durable execution systems run our code in a way that persists each step the code takes. If the process or container running the code dies, the code automatically continues running in another process with all state intact, including call stack and local variables.

Durable execution ensures that the code is executed to completion, no matter how reliable the hardware or how long downstream services are offline. Retries and timeouts are performed automatically, and resources are freed up when the code isn’t doing anything (for example while waiting on a sleep(‘30 days’) statement).

Durable execution makes it trivial or unnecessary to implement distributed systems patterns like event-driven architecture, task queues, sagas, circuit breakers, and transactional outboxes. It’s programming on a higher level of abstraction, where you don’t have to be concerned about transient failures like server crashes or network issues. It opens up new possibilities like:

- Storing state in local variables instead of a database, because local variables are automatically stored for us
- Writing code that sleeps for a month, because we don’t need to be concerned about the process that started the sleep still being there next month, or resources being tied up for the duration
- Functions that can run forever, and that we can interact with (send commands to or query data from)
