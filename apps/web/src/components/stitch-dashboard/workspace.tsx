"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { logout } from "@/lib/auth-api";
import {
  cancelLogout,
  completeLogout,
  failLogout,
  type LogoutState,
} from "@/lib/auth-ui-state";

import { chatUserAvatar, userAvatar } from "./assets";
import {
  ArrowRight,
  ArrowUp,
  Bot,
  Boxes,
  Download,
  Edit3,
  Ellipsis,
  History,
  LogOut,
  PanelLeftClose,
  PlusCircle,
  Trash2,
  User,
  X,
} from "./icons";

type WorkspaceProps = {
  showAccountModal?: boolean;
};

const recentSessions = ["Project Ideas", "Code Review", "Travel Planning"];

export function ChatWorkspace({ showAccountModal = false }: WorkspaceProps) {
  const router = useRouter();
  const [isAccountOpen, setIsAccountOpen] = useState(showAccountModal);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [sessions, setSessions] = useState(recentSessions);
  const [openSessionMenu, setOpenSessionMenu] = useState<string | null>(null);
  const [logoutState, setLogoutState] = useState<LogoutState>({
    status: "closed",
  });
  const [message, setMessage] = useState("");
  const [sentPulse, setSentPulse] = useState(false);

  function sendMessage() {
    if (!message.trim()) return;
    setMessage("");
    setSentPulse(true);
    window.setTimeout(() => setSentPulse(false), 500);
  }

  function closeLogoutDialog() {
    if (logoutState.status === "submitting") return;
    setLogoutState(cancelLogout());
  }

  useEffect(() => {
    if (!openSessionMenu) return;

    function closeMenuOnOutsidePointerDown(event: PointerEvent) {
      if (!(event.target instanceof Element)) return;
      if (event.target.closest(".stitch-session-row")) return;
      setOpenSessionMenu(null);
    }

    function closeMenuOnEscape(event: KeyboardEvent) {
      if (event.key !== "Escape") return;
      setOpenSessionMenu(null);
    }

    document.addEventListener("pointerdown", closeMenuOnOutsidePointerDown);
    document.addEventListener("keydown", closeMenuOnEscape);

    return () => {
      document.removeEventListener("pointerdown", closeMenuOnOutsidePointerDown);
      document.removeEventListener("keydown", closeMenuOnEscape);
    };
  }, [openSessionMenu]);

  function softDeleteSession(session: string) {
    setSessions((currentSessions) =>
      currentSessions.filter((currentSession) => currentSession !== session),
    );
    setOpenSessionMenu(null);
  }

  async function confirmLogout() {
    setLogoutState({ status: "submitting" });

    try {
      await logout();
      setLogoutState(completeLogout());
      router.push("/");
      router.refresh();
    } catch (error) {
      setLogoutState(failLogout(error));
    }
  }

  return (
    <div className="stitch-workspace-root h-dvh overflow-hidden bg-white text-[#1a1c1c]">
      <style>{`
        .stitch-workspace-root {
          height: 100dvh;
          overflow: hidden;
          background: #ffffff;
          color: #1a1c1c;
        }
        .stitch-workspace-root a,
        .stitch-workspace-root button,
        .stitch-workspace-root [role="button"] {
          cursor: pointer;
        }
        .stitch-workspace-root button:disabled {
          cursor: default;
        }
        .stitch-sidebar {
          position: fixed;
          left: 0;
          top: 0;
          z-index: 40;
          display: none;
          width: 280px;
          height: 100dvh;
          flex-direction: column;
          border-right: 1px solid #efefef;
          background: #f8f8f8;
          padding: 18px 12px 16px;
          transition: width 180ms ease;
        }
        .stitch-sidebar-collapsed {
          width: 72px;
        }
        .stitch-sidebar-brand {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          min-height: 40px;
          margin-bottom: 26px;
          padding: 0 6px;
        }
        .stitch-brand-link {
          display: flex;
          min-width: 0;
          align-items: center;
          gap: 16px;
          color: #1a1c1c;
        }
        .stitch-brand-link-collapsed {
          cursor: pointer;
        }
        .stitch-brand-mark {
          display: inline-flex;
          width: 28px;
          height: 28px;
          flex: 0 0 auto;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          border-radius: 7px;
          background: #f6f1e8;
        }
        .stitch-brand-mark img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .stitch-brand-wordmark {
          display: block;
          width: 104px;
          height: auto;
        }
        .stitch-brand-text,
        .stitch-brand-wordmark,
        .stitch-sidebar-item-text,
        .stitch-sidebar-label,
        .stitch-sidebar-more,
        .stitch-upgrade-button {
          transition: opacity 120ms ease;
        }
        .stitch-sidebar-toggle {
          display: inline-flex;
          width: 32px;
          height: 32px;
          flex: 0 0 auto;
          align-items: center;
          justify-content: center;
          border-radius: 8px;
          color: #4a4a4a;
          transition: background 150ms ease, color 150ms ease;
        }
        .stitch-sidebar-toggle:hover {
          background: #eeeeee;
          color: #1a1c1c;
        }
        .stitch-sidebar-nav {
          display: flex;
          flex-direction: column;
          gap: 8px;
          flex: 1;
          overflow-y: auto;
          padding: 0 2px;
        }
        .stitch-sidebar-label {
          margin-bottom: 8px;
          padding: 8px 10px;
          font-size: 14px;
          font-weight: 500;
          letter-spacing: 0;
          text-transform: none;
          color: #6b6b6b;
        }
        .stitch-sidebar-label-spaced {
          margin-top: 26px;
        }
        .stitch-sidebar-item {
          display: flex;
          width: 100%;
          align-items: center;
          gap: 12px;
          border-radius: 8px;
          padding: 7px 10px;
          text-align: left;
          font-size: 14px;
          font-weight: 500;
          color: #3f3f3f;
          transition: background 150ms ease, color 150ms ease;
        }
        .stitch-sidebar-item:hover {
          background: #eeeeee;
          color: #1a1c1c;
        }
        .stitch-session-row {
          position: relative;
          display: flex;
          min-height: 38px;
          align-items: center;
          border-radius: 8px;
          color: #3f3f3f;
          transition: background 150ms ease, color 150ms ease;
        }
        .stitch-session-row:hover,
        .stitch-session-row-active {
          background: #f0f0f0;
          color: #1a1c1c;
        }
        .stitch-session-main {
          display: flex;
          min-width: 0;
          flex: 1;
          align-items: center;
          align-self: stretch;
          padding: 7px 8px 7px 10px;
          text-align: left;
          font-size: 14px;
          font-weight: 500;
          color: inherit;
        }
        .stitch-session-main:focus-visible,
        .stitch-sidebar-more:focus-visible {
          outline: 1px solid #d8d8d8;
          outline-offset: -2px;
        }
        .stitch-sidebar-more {
          display: inline-flex;
          width: 32px;
          height: 32px;
          flex: 0 0 auto;
          align-items: center;
          justify-content: center;
          margin-right: 3px;
          border-radius: 8px;
          color: #3f3f3f;
          opacity: 0;
          transition: background 150ms ease, color 150ms ease, opacity 120ms ease;
        }
        .stitch-session-row:hover .stitch-sidebar-more,
        .stitch-session-row-active .stitch-sidebar-more,
        .stitch-sidebar-more[aria-expanded="true"] {
          opacity: 1;
        }
        .stitch-sidebar-more:hover {
          background: #e7e7e7;
          color: #1a1c1c;
        }
        .stitch-sidebar-more[aria-expanded="true"] {
          background: #e9e9e9;
          color: #1a1c1c;
        }
        .stitch-session-menu {
          position: absolute;
          top: calc(100% + 8px);
          right: 18px;
          z-index: 60;
          min-width: 132px;
          border: 1px solid #e9e9e9;
          border-radius: 8px;
          background: #ffffff;
          padding: 4px;
          box-shadow: 0 14px 30px rgba(0, 0, 0, 0.09);
        }
        .stitch-session-menu-item {
          display: flex;
          width: 100%;
          align-items: center;
          gap: 8px;
          border-radius: 6px;
          padding: 8px;
          text-align: left;
          font-size: 13px;
          font-weight: 500;
          color: #b42318;
        }
        .stitch-session-menu-item:hover,
        .stitch-session-menu-item:focus-visible {
          background: #fff1f0;
          outline: none;
        }
        .stitch-sidebar-item-active {
          border-right: 0;
          border-radius: 8px;
          background: #eeeeee;
          color: #1a1c1c;
        }
        .stitch-sidebar-stack {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .stitch-sidebar-footer {
          display: flex;
          flex-direction: column;
          gap: 8px;
          margin-top: auto;
          border-top: 1px solid #e7e7e7;
          padding: 12px 2px 0;
        }
        .stitch-upgrade-button {
          width: 100%;
          height: 44px;
          margin-bottom: 16px;
          border-radius: 8px;
          background: #1a1c1c;
          color: #ffffff;
          font-size: 14px;
          font-weight: 600;
        }
        .stitch-workspace-main {
          display: flex;
          height: 100dvh;
          flex-direction: column;
          background: #ffffff;
          transition: margin-left 180ms ease;
        }
        .stitch-message-avatar img,
        .stitch-account-avatar img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .stitch-chat-scroll {
          position: relative;
          flex: 1;
          overflow-y: auto;
          padding: 32px 16px;
        }
        .stitch-thread {
          display: flex;
          max-width: 880px;
          margin: 0 auto;
          flex-direction: column;
          gap: 48px;
          padding-bottom: 128px;
        }
        .stitch-date-row {
          display: flex;
          justify-content: center;
        }
        .stitch-date-pill {
          border-radius: 999px;
          border: 1px solid #efefef;
          background: #fafafa;
          padding: 6px 16px;
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: rgba(107, 107, 107, 0.6);
        }
        .stitch-message-row {
          display: flex;
          gap: 16px;
        }
        .stitch-message-row-user {
          flex-direction: row-reverse;
        }
        .stitch-message-avatar {
          display: flex;
          width: 32px;
          height: 32px;
          flex: 0 0 auto;
          align-items: center;
          justify-content: center;
          margin-top: 4px;
          overflow: hidden;
          border: 1px solid #efefef;
          border-radius: 999px;
          background: #ffffff;
        }
        .stitch-message-avatar-ai {
          border: 0;
          border-radius: 8px;
          background: #1a1c1c;
          color: #ffffff;
        }
        .stitch-message-bubble {
          max-width: 85%;
          border: 1px solid #efefef;
          border-radius: 16px;
          background: #ffffff;
          padding: 24px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
        }
        .stitch-message-bubble-ai {
          border-top-left-radius: 0;
        }
        .stitch-message-bubble-user {
          border-top-right-radius: 0;
          background: #fafafa;
        }
        .stitch-message-text {
          font-size: 15px;
          line-height: 1.75;
          color: #1a1c1c;
        }
        .stitch-ai-response {
          width: 100%;
          border: 1px solid #efefef;
          border-radius: 16px;
          border-top-left-radius: 0;
          background: #ffffff;
          padding: 24px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
        }
        .stitch-concept-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 16px;
          margin-top: 24px;
        }
        .stitch-concept-card,
        .stitch-concept-dark,
        .stitch-concept-wide {
          border-radius: 12px;
          padding: 16px;
        }
        .stitch-concept-card {
          display: flex;
          min-height: 152px;
          cursor: pointer;
          flex-direction: column;
          justify-content: space-between;
          border: 1px solid #efefef;
          background: #fafafa;
        }
        .stitch-concept-dark {
          display: flex;
          min-height: 152px;
          cursor: pointer;
          flex-direction: column;
          justify-content: space-between;
          background: #1a1c1c;
          color: #ffffff;
        }
        .stitch-concept-wide {
          display: flex;
          cursor: pointer;
          align-items: center;
          gap: 16px;
          border: 1px solid #efefef;
          background: #ffffff;
        }
        .stitch-concept-icon {
          display: flex;
          width: 48px;
          height: 48px;
          flex: 0 0 auto;
          align-items: center;
          justify-content: center;
          border-radius: 8px;
          border: 1px solid #efefef;
          background: #fafafa;
        }
        .stitch-composer-wrap {
          pointer-events: none;
          position: sticky;
          bottom: 0;
          background: transparent;
          padding: 16px;
        }
        .stitch-composer-inner {
          pointer-events: auto;
          max-width: 900px;
          margin: 0 auto;
        }
        .stitch-composer {
          display: flex;
          min-height: 96px;
          flex-direction: column;
          justify-content: space-between;
          border-radius: 22px;
          border: 1px solid #efefef;
          background: #ffffff;
          padding: 14px 16px;
          box-shadow: 0 14px 34px rgba(0, 0, 0, 0.07);
        }
        .stitch-composer-input {
          width: 100%;
          min-height: 36px;
          max-height: 96px;
          resize: none;
          border: 0;
          background: transparent;
          padding: 0;
          font-size: 16px;
          line-height: 1.5;
          color: #1a1c1c;
          outline: none;
        }
        .stitch-composer-input::placeholder {
          color: rgba(107, 107, 107, 0.55);
        }
        .stitch-composer-toolbar {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          margin-top: 8px;
        }
        .stitch-send-button {
          display: inline-flex;
          width: 36px;
          height: 36px;
          align-items: center;
          justify-content: center;
          border-radius: 999px;
          background: #e9e9e9;
          color: #9b9b9b;
          transition: background 150ms ease, color 150ms ease, transform 150ms ease;
        }
        .stitch-send-button:hover {
          background: #dedede;
          color: #6f6f6f;
        }
        .stitch-send-button:active {
          transform: scale(0.96);
        }
        .stitch-logout-actions {
          display: flex;
          justify-content: flex-end;
          gap: 8px;
        }
        .stitch-logout-button {
          display: inline-flex;
          min-width: 76px;
          height: 36px;
          align-items: center;
          justify-content: center;
          border-radius: 10px;
          padding: 0 16px;
          font-size: 13px;
          font-weight: 500;
          line-height: 1;
        }
        .stitch-account-overlay {
          position: fixed;
          inset: 0;
          z-index: 100;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(0, 0, 0, 0.05);
          padding: 16px;
          backdrop-filter: blur(2px);
        }
        .stitch-account-modal {
          width: 100%;
          max-width: 576px;
          overflow: hidden;
          border-radius: 16px;
          border: 1px solid #efefef;
          background: #ffffff;
          box-shadow: 0 18px 50px rgba(0, 0, 0, 0.16);
        }
        .stitch-account-head {
          border-bottom: 1px solid rgba(239, 239, 239, 0.7);
          padding: 32px 32px 24px;
        }
        .stitch-account-person {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 20px;
          margin-bottom: 32px;
        }
        .stitch-account-profile {
          display: flex;
          min-width: 0;
          align-items: center;
          gap: 20px;
        }
        .stitch-account-avatar {
          width: 80px;
          height: 80px;
          flex: 0 0 auto;
          overflow: hidden;
          border-radius: 999px;
          border: 2px solid #efefef;
        }
        .stitch-account-actions {
          display: flex;
          gap: 12px;
        }
        .stitch-account-action {
          display: flex;
          flex: 1;
          align-items: center;
          justify-content: center;
          gap: 8px;
          border-radius: 8px;
          border: 1px solid #efefef;
          padding: 10px 12px;
          font-size: 14px;
          font-weight: 600;
        }
        .stitch-account-body {
          display: flex;
          flex-direction: column;
          gap: 40px;
          padding: 32px;
        }
        .stitch-account-stats {
          display: grid;
          grid-template-columns: 1fr;
          gap: 32px;
        }
        .stitch-usage-bars {
          display: flex;
          height: 96px;
          align-items: flex-end;
          justify-content: space-between;
          padding: 0 8px;
        }
        .stitch-bar-item {
          display: flex;
          height: 100%;
          flex-direction: column;
          align-items: center;
          justify-content: flex-end;
          gap: 8px;
        }
        .stitch-plan-badge {
          border-radius: 999px;
          background: #1a1c1c;
          padding: 2px 8px;
          color: #ffffff;
          font-size: 10px;
          font-weight: 700;
        }
        .stitch-progress-track {
          height: 6px;
          margin-top: 12px;
          overflow: hidden;
          border-radius: 999px;
          background: #f5f5f5;
        }
        .stitch-primary-full {
          width: 100%;
          border-radius: 12px;
          background: #1a1c1c;
          padding: 16px;
          color: #ffffff;
          font-size: 14px;
          font-weight: 600;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
        }
        @media (min-width: 768px) {
          .stitch-sidebar {
            display: flex;
          }
          .stitch-workspace-main {
            margin-left: 280px;
          }
          .stitch-workspace-main-collapsed {
            margin-left: 72px;
          }
          .stitch-chat-scroll {
            padding-left: 24px;
            padding-right: 24px;
          }
          .stitch-composer-wrap {
            padding: 20px 28px 24px;
          }
          .stitch-sidebar-collapsed .stitch-sidebar-brand {
            justify-content: center;
            padding: 0;
          }
          .stitch-sidebar-collapsed .stitch-brand-mark {
            width: 32px;
            height: 32px;
          }
          .stitch-sidebar-collapsed .stitch-brand-text,
          .stitch-sidebar-collapsed .stitch-brand-wordmark,
          .stitch-sidebar-collapsed .stitch-sidebar-item-text,
          .stitch-sidebar-collapsed .stitch-sidebar-label,
          .stitch-sidebar-collapsed .stitch-sidebar-more,
          .stitch-sidebar-collapsed .stitch-upgrade-button {
            display: none;
          }
          .stitch-sidebar-collapsed .stitch-sidebar-toggle {
            display: none;
          }
          .stitch-sidebar-collapsed .stitch-sidebar-nav {
            padding-top: 4px;
          }
          .stitch-sidebar-collapsed .stitch-sidebar-item {
            width: 38px;
            height: 38px;
            justify-content: center;
            padding: 0;
          }
          .stitch-sidebar-collapsed .stitch-sidebar-label-spaced,
          .stitch-sidebar-collapsed .stitch-sidebar-stack {
            display: none;
          }
          .stitch-sidebar-collapsed .stitch-sidebar-footer {
            border-top: 0;
          }
        }
        @media (min-width: 640px) {
          .stitch-account-stats {
            grid-template-columns: 1fr 1fr;
          }
        }
        @media (min-width: 768px) {
          .stitch-concept-grid {
            grid-template-columns: repeat(3, minmax(0, 1fr));
          }
          .stitch-concept-card {
            grid-column: span 2;
          }
          .stitch-concept-wide {
            grid-column: span 3;
          }
        }
        @media (max-width: 767px) {
          .stitch-composer {
            min-height: 92px;
            padding: 12px;
          }
          .stitch-composer-input {
            min-height: 34px;
            font-size: 15px;
          }
        }
      `}</style>
      <aside
        className={`stitch-sidebar hidden md:flex ${
          isSidebarCollapsed ? "stitch-sidebar-collapsed" : ""
        }`}
      >
        <div className="stitch-sidebar-brand">
          <Link
            aria-label={isSidebarCollapsed ? "Expand sidebar" : "lnkling chat"}
            className={`stitch-brand-link ${
              isSidebarCollapsed ? "stitch-brand-link-collapsed" : ""
            }`}
            href="/chat"
            onClick={(event) => {
              if (!isSidebarCollapsed) return;
              event.preventDefault();
              setIsSidebarCollapsed(false);
            }}
          >
            <span className="stitch-brand-mark">
              <img alt="" src="/lnkling-logo.png" />
            </span>
            <img
              alt="lnkling"
              className="stitch-brand-wordmark"
              src="/lnkling-wordmark.png"
            />
          </Link>
          <button
            aria-label="Collapse sidebar"
            className="stitch-sidebar-toggle"
            onClick={() => setIsSidebarCollapsed(true)}
            type="button"
          >
            <PanelLeftClose size={19} strokeWidth={1.7} />
          </button>
        </div>

        <nav className="stitch-sidebar-nav">
          <button
            aria-label="New chat"
            className="stitch-sidebar-item"
            type="button"
          >
            <PlusCircle size={18} strokeWidth={1.5} />
            <span className="stitch-sidebar-item-text">New</span>
          </button>
          <button
            aria-label="Library"
            className="stitch-sidebar-item"
            type="button"
          >
            <History size={18} strokeWidth={1.5} />
            <span className="stitch-sidebar-item-text">Library</span>
          </button>

          <div className="stitch-sidebar-label stitch-sidebar-label-spaced">
            All Tasks
          </div>
          <div className="stitch-sidebar-stack">
            {sessions.map((session) => (
              <div
                className={`stitch-session-row group ${
                  openSessionMenu === session ? "stitch-session-row-active" : ""
                }`}
                key={session}
              >
                <button
                  aria-label={session}
                  className="stitch-session-main"
                  onClick={() => setOpenSessionMenu(null)}
                  type="button"
                >
                  <span className="stitch-sidebar-item-text truncate">
                    {session}
                  </span>
                </button>
                <button
                  aria-expanded={openSessionMenu === session}
                  aria-haspopup="menu"
                  aria-label={`${session} options`}
                  className="stitch-sidebar-more"
                  onClick={(event) => {
                    event.stopPropagation();
                    setOpenSessionMenu((currentSession) =>
                      currentSession === session ? null : session,
                    );
                  }}
                  type="button"
                >
                  <Ellipsis size={18} strokeWidth={1.8} />
                </button>
                {openSessionMenu === session ? (
                  <div className="stitch-session-menu" role="menu">
                    <button
                      className="stitch-session-menu-item"
                      onClick={() => softDeleteSession(session)}
                      role="menuitem"
                      type="button"
                    >
                      <Trash2 size={15} strokeWidth={1.7} />
                      <span>Delete</span>
                    </button>
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        </nav>

        <div className="stitch-sidebar-footer">
          <button className="stitch-upgrade-button" type="button">
            Upgrade to Pro
          </button>
          <button
            aria-label="Account"
            className={`stitch-sidebar-item ${
              isAccountOpen ? "stitch-sidebar-item-active" : ""
            }`}
            onClick={() => setIsAccountOpen(true)}
            type="button"
          >
            <User size={17} strokeWidth={1.5} />
            <span className="stitch-sidebar-item-text">Account</span>
          </button>
          <button
            aria-label="Logout"
            className="stitch-sidebar-item"
            onClick={() => setLogoutState({ status: "confirming" })}
            type="button"
          >
            <LogOut size={17} strokeWidth={1.5} />
            <span className="stitch-sidebar-item-text">Logout</span>
          </button>
        </div>
      </aside>

      <main
        className={`stitch-workspace-main flex h-dvh flex-col bg-white ${
          isSidebarCollapsed ? "stitch-workspace-main-collapsed" : ""
        }`}
      >
        <section className="stitch-chat-scroll relative flex-1 overflow-y-auto px-4 py-8 sm:px-6">
          <div className="stitch-thread mx-auto space-y-12 pb-32">
            <div className="stitch-date-row flex justify-center">
              <span className="stitch-date-pill rounded-full border border-[#efefef] bg-[#fafafa] px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest text-[#6b6b6b]/60">
                Today
              </span>
            </div>
            <AiMessage>
              Hello! I&apos;m your AI assistant. How can I help you with your
              projects today? I&apos;ve indexed your recent notes on
              &apos;Project Ideas&apos; and &apos;Code Review&apos;.
            </AiMessage>
            <UserMessage>
              Can you help me refine the UI architecture for a new dashboard? I
              want to use a minimalist grid layout with monochromatic tones.
            </UserMessage>
            <AiLayoutResponse />
          </div>
        </section>

        <footer className="stitch-composer-wrap pointer-events-none sticky bottom-0 bg-transparent p-4 sm:p-6">
          <div className="stitch-composer-inner pointer-events-auto mx-auto">
            <div className="stitch-composer">
              <textarea
                className="stitch-composer-input"
                onChange={(event) => setMessage(event.target.value)}
                placeholder="Type your question here"
                rows={2}
                value={message}
              />
              <div className="stitch-composer-toolbar">
                <button
                  aria-label="Send message"
                  className="stitch-send-button"
                  onClick={sendMessage}
                  type="button"
                >
                  <ArrowUp
                    className={sentPulse ? "animate-ping" : ""}
                    size={20}
                    strokeWidth={1.7}
                  />
                </button>
              </div>
            </div>
          </div>
        </footer>
      </main>

      {isAccountOpen ? (
        <AccountModal onClose={() => setIsAccountOpen(false)} />
      ) : null}
      {logoutState.status !== "closed" && logoutState.status !== "success" ? (
        <LogoutConfirmationDialog
          isSubmitting={logoutState.status === "submitting"}
          error={logoutState.status === "error" ? logoutState.error : null}
          onCancel={closeLogoutDialog}
          onConfirm={confirmLogout}
        />
      ) : null}
    </div>
  );
}

function AiMessage({ children }: { children: React.ReactNode }) {
  return (
    <div className="stitch-message-row flex gap-4">
      <div className="stitch-message-avatar stitch-message-avatar-ai mt-1 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-[#1a1c1c] text-white">
        <Bot size={18} fill="currentColor" strokeWidth={1.5} />
      </div>
      <div className="stitch-message-bubble stitch-message-bubble-ai max-w-[85%] rounded-2xl rounded-tl-none border border-[#efefef] bg-white p-6 shadow-sm">
        <p className="stitch-message-text text-[15px] leading-7 text-[#1a1c1c]">
          {children}
        </p>
      </div>
    </div>
  );
}

function UserMessage({ children }: { children: React.ReactNode }) {
  return (
    <div className="stitch-message-row stitch-message-row-user flex flex-row-reverse gap-4">
      <div className="stitch-message-avatar mt-1 h-8 w-8 flex-shrink-0 overflow-hidden rounded-full border border-[#efefef]">
        <img
          alt="User"
          className="h-full w-full object-cover"
          src={chatUserAvatar}
        />
      </div>
      <div className="stitch-message-bubble stitch-message-bubble-user max-w-[85%] rounded-2xl rounded-tr-none border border-[#efefef] bg-[#fafafa] p-6 shadow-sm">
        <p className="stitch-message-text text-[15px] leading-7 text-[#1a1c1c]">
          {children}
        </p>
      </div>
    </div>
  );
}

function AiLayoutResponse() {
  return (
    <div className="stitch-message-row flex gap-4">
      <div className="stitch-message-avatar stitch-message-avatar-ai mt-1 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-[#1a1c1c] text-white">
        <Bot size={18} fill="currentColor" strokeWidth={1.5} />
      </div>
      <div className="stitch-ai-response w-full space-y-6 rounded-2xl rounded-tl-none border border-[#efefef] bg-white p-6 shadow-sm">
        <p className="stitch-message-text text-[15px] leading-7 text-[#1a1c1c]">
          For a minimalist dashboard, I recommend a{" "}
          <strong>Bento-style Grid</strong>. Here are three layout concepts we
          could explore:
        </p>
        <div className="stitch-concept-grid grid grid-cols-1 gap-4 md:h-64 md:grid-cols-3">
          <ConceptCard
            className="md:col-span-2"
            icon={<Boxes size={20} strokeWidth={1.5} />}
            label="Concept A"
            title="Fluid Dynamics"
          >
            Variable card heights based on data density.
          </ConceptCard>
          <div className="stitch-concept-dark flex cursor-pointer flex-col justify-between rounded-xl bg-[#1a1c1c] p-4 text-white transition hover:opacity-90">
            <span className="text-[11px] font-bold uppercase tracking-widest opacity-50">
              Concept B
            </span>
            <div>
              <h4 className="mb-1 text-lg font-semibold">Strict Core</h4>
              <p className="text-xs leading-5 opacity-70">
                Perfect squares only.
              </p>
            </div>
          </div>
          <div className="stitch-concept-wide flex cursor-pointer items-center gap-4 rounded-xl border border-[#efefef] bg-white p-4 transition hover:border-[#1a1c1c] md:col-span-3">
            <div className="stitch-concept-icon flex h-12 w-12 items-center justify-center rounded-lg border border-[#efefef] bg-[#fafafa]">
              <Boxes size={20} strokeWidth={1.5} />
            </div>
            <div className="flex-1">
              <h4 className="text-lg font-semibold">Editorial Layering</h4>
              <p className="text-xs leading-5 text-[#6b6b6b]">
                Focus on typography hierarchy and extreme whitespace.
              </p>
            </div>
            <ArrowRight size={18} strokeWidth={1.5} />
          </div>
        </div>
      </div>
    </div>
  );
}

function ConceptCard({
  children,
  className,
  icon,
  label,
  title,
}: {
  children: React.ReactNode;
  className?: string;
  icon: React.ReactNode;
  label: string;
  title: string;
}) {
  return (
    <div
      className={`stitch-concept-card flex cursor-pointer flex-col justify-between rounded-xl border border-[#efefef] bg-[#fafafa] p-4 transition hover:bg-white ${className ?? ""}`}
    >
      <div className="flex items-start justify-between">
        <span className="text-[11px] font-bold uppercase tracking-widest text-[#6b6b6b]/50">
          {label}
        </span>
        {icon}
      </div>
      <div>
        <h4 className="mb-1 text-lg font-semibold">{title}</h4>
        <p className="text-xs leading-5 text-[#6b6b6b]">{children}</p>
      </div>
    </div>
  );
}

function AccountModal({ onClose }: { onClose: () => void }) {
  const usage: Array<{ day: string; height: string; active: boolean }> = [
    { day: "MON", height: "40%", active: false },
    { day: "TUE", height: "85%", active: true },
    { day: "WED", height: "55%", active: false },
    { day: "THU", height: "30%", active: false },
    { day: "FRI", height: "95%", active: true },
    { day: "SAT", height: "20%", active: false },
    { day: "SUN", height: "15%", active: false },
  ];

  return (
    <div
      className="stitch-account-overlay fixed inset-0 z-[100] flex items-center justify-center bg-black/5 p-4 backdrop-blur-[2px]"
      onClick={onClose}
    >
      <section
        aria-label="Account settings"
        className="stitch-account-modal w-full max-w-xl overflow-hidden rounded-2xl border border-[#efefef] bg-white shadow-[0_18px_50px_rgba(0,0,0,0.16)]"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="stitch-account-head border-b border-[#efefef]/70 px-8 pb-6 pt-8">
          <div className="stitch-account-person mb-8 flex items-start justify-between gap-5">
            <div className="stitch-account-profile flex min-w-0 items-center gap-5">
              <div className="stitch-account-avatar h-20 w-20 flex-shrink-0 overflow-hidden rounded-full border-2 border-[#efefef]">
                <img
                  alt="Julian Sterling"
                  className="h-full w-full object-cover"
                  src={userAvatar}
                />
              </div>
              <div className="min-w-0">
                <h2 className="text-3xl font-bold leading-tight tracking-normal">
                  Julian Sterling
                </h2>
                <p className="truncate text-sm text-[#6b6b6b]">
                  julian.s@optical-minimal.com
                </p>
              </div>
            </div>
            <button
              className="rounded-full p-2 transition hover:bg-[#fafafa]"
              onClick={onClose}
              type="button"
            >
              <X size={18} strokeWidth={1.5} />
            </button>
          </div>
          <div className="stitch-account-actions flex gap-3">
            <button
              className="stitch-account-action flex flex-1 items-center justify-center gap-2 rounded-lg border border-[#efefef] py-2.5 text-sm font-semibold transition hover:bg-[#fafafa]"
              type="button"
            >
              <Edit3 size={16} strokeWidth={1.5} />
              Edit Profile
            </button>
            <button
              className="stitch-account-action flex flex-1 items-center justify-center gap-2 rounded-lg border border-[#efefef] py-2.5 text-sm font-semibold transition hover:bg-[#fafafa]"
              type="button"
            >
              <Download size={16} strokeWidth={1.5} />
              Export Data
            </button>
          </div>
        </div>

        <div className="stitch-account-body space-y-10 px-8 py-8">
          <div className="stitch-account-stats grid grid-cols-1 gap-8 sm:grid-cols-2">
            <div>
              <p className="mb-3 text-[11px] font-bold uppercase tracking-widest text-[#6b6b6b]/50">
                Token Consumption
              </p>
              <p className="mb-1 text-2xl font-bold">
                85,000{" "}
                <span className="text-sm font-normal text-[#6b6b6b]">
                  / 100k
                </span>
              </p>
              <div className="stitch-progress-track mt-3 h-1.5 overflow-hidden rounded-full bg-[#f5f5f5]">
                <div className="h-full w-[85%] rounded-full bg-[#1a1c1c]" />
              </div>
            </div>
            <div>
              <p className="mb-3 text-[11px] font-bold uppercase tracking-widest text-[#6b6b6b]/50">
                Current Plan
              </p>
              <div className="flex items-center gap-2">
                <p className="text-2xl font-bold">Premium</p>
                <span className="stitch-plan-badge rounded-full bg-[#1a1c1c] px-2 py-0.5 text-[10px] font-bold text-white">
                  ACTIVE
                </span>
              </div>
              <p className="mt-1 text-xs text-[#6b6b6b]">Renews Jan 12, 2025</p>
            </div>
          </div>

          <div>
            <p className="mb-6 text-[11px] font-bold uppercase tracking-widest text-[#6b6b6b]/50">
              Last 7 Days Usage
            </p>
            <div
              className="stitch-usage-bars flex items-end justify-between px-2"
              style={{ height: 96 }}
            >
              {usage.map((item) => (
                <div
                  className="stitch-bar-item flex flex-col items-center gap-2"
                  key={item.day}
                >
                  <div
                    className="rounded-t-sm"
                    style={{
                      backgroundColor: item.active ? "#1a1c1c" : "#f5f5f5",
                      height: item.height,
                      width: 32,
                    }}
                  />
                  <span className="text-[9px] font-bold text-[#6b6b6b]/40">
                    {item.day}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <button
            className="stitch-primary-full w-full rounded-xl bg-[#1a1c1c] py-4 text-sm font-semibold text-white shadow-[0_4px_12px_rgba(0,0,0,0.05)] transition hover:opacity-90 active:scale-[0.98]"
            type="button"
          >
            Upgrade to Unlimited Plan
          </button>
        </div>
      </section>
    </div>
  );
}

function LogoutConfirmationDialog({
  error,
  isSubmitting,
  onCancel,
  onConfirm,
}: {
  error: string | null;
  isSubmitting: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-[110] flex items-center justify-center bg-black/20 p-4 backdrop-blur-[2px]"
      onClick={onCancel}
    >
      <section
        aria-describedby="logout-confirmation-description"
        aria-labelledby="logout-confirmation-title"
        aria-modal="true"
        className="w-full max-w-sm rounded-2xl border border-[#e5e5e5] bg-white p-6 shadow-[0_20px_60px_rgba(0,0,0,0.18)]"
        onClick={(event) => event.stopPropagation()}
        role="dialog"
      >
        <div className="mb-6 flex items-start gap-4">
          <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-[#f5f5f5]">
            <LogOut size={18} strokeWidth={1.6} />
          </span>
          <div>
            <h2
              className="text-lg font-semibold text-[#1a1c1c]"
              id="logout-confirmation-title"
            >
              Log out of lnkling?
            </h2>
            <p
              className="mt-2 text-sm leading-6 text-[#6b6b6b]"
              id="logout-confirmation-description"
            >
              You&apos;ll need to sign in again to return to your chats.
            </p>
          </div>
        </div>

        {error ? (
          <p
            className="mb-5 rounded-lg border border-[#f3c6c6] bg-[#fff7f7] px-3 py-2.5 text-xs leading-5 text-[#9b1c1c]"
            role="alert"
          >
            {error}
          </p>
        ) : null}

        <div className="stitch-logout-actions">
          <button
            className="stitch-logout-button border border-[#d9d9d9] bg-white text-[#1a1c1c] transition hover:bg-[#fafafa] disabled:cursor-not-allowed disabled:opacity-60"
            disabled={isSubmitting}
            onClick={onCancel}
            type="button"
          >
            Cancel
          </button>
          <button
            className="stitch-logout-button border border-[#1a1c1c] bg-[#1a1c1c] text-white transition hover:bg-[#333] disabled:cursor-not-allowed disabled:opacity-60"
            disabled={isSubmitting}
            onClick={onConfirm}
            type="button"
          >
            {isSubmitting ? "Logging out..." : error ? "Try Again" : "Log Out"}
          </button>
        </div>
      </section>
    </div>
  );
}
