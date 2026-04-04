import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, X, Bell, Trophy, PhoneIncoming } from "lucide-react";

export type IslandState = "default" | "call" | "message" | "alert" | "logout";

export interface IslandPayload {
  state: IslandState;
  title?: string;
  subtitle?: string;
  name?: string;
  avatarStr?: string;
  onAccept?: () => void;
  onDecline?: () => void;
  onClick?: () => void;
}

const EASE_APPLE: [number, number, number, number] = [0.32, 0, 0.12, 1];

export default function DynamicIsland() {
  const [activeState, setActiveState] = useState<IslandState>("default");
  const [payload, setPayload] = useState<IslandPayload | null>(null);
  const [animatingBounce, setAnimatingBounce] = useState(false);
  const [animatingRing, setAnimatingRing] = useState(false);

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Expose a global hook-like function via window for easy global triggering
  useEffect(() => {
    const handleIslandEvent = (e: Event) => {
      const event = e as CustomEvent<IslandPayload>;
      const { state } = event.detail;

      if (timeoutRef.current) clearTimeout(timeoutRef.current);

      setActiveState(state);
      setPayload(event.detail);
      
      // Trigger bounces
      setAnimatingBounce(false);
      setAnimatingRing(false);
      
      // small delay to permit DOM reset for CSS animation
      setTimeout(() => {
        setAnimatingBounce(true);
        if (state !== "default") {
          setAnimatingRing(true);
        }
      }, 10);

      // Auto dismiss logic
      if (state === "message" || state === "alert") {
        timeoutRef.current = setTimeout(() => {
          setActiveState("default");
          setAnimatingBounce(true);
        }, 9000);
      }
      // 'call' and 'logout' states do not auto-dismiss
    };

    window.addEventListener("trigger-island", handleIslandEvent);
    return () => window.removeEventListener("trigger-island", handleIslandEvent);
  }, []);

  // Frame variations mapping strictly to user request
  const variants = {
    default: { width: 126, height: 36, borderRadius: 40 },
    call: { width: 290, height: 90, borderRadius: 44 },
    message: { width: 290, height: 80, borderRadius: 44 },
    alert: { width: 290, height: 72, borderRadius: 44 },
    logout: { width: 310, height: 85, borderRadius: 44 },
  };

  const currentVariant = variants[activeState];

  return (
    <div className="fixed top-2 inset-x-0 z-[100] flex justify-center pointer-events-none">
      <div className="relative pointer-events-auto">
        {/* The Animated Ring (Expanding border) */}
        {animatingRing && activeState !== "default" && (
          <motion.div
            initial={{ width: variants.default.width, height: variants.default.height, borderRadius: variants.default.borderRadius, opacity: 0.8, scale: 1 }}
            animate={{ width: currentVariant.width, height: currentVariant.height, borderRadius: currentVariant.borderRadius, opacity: 0, scale: 1.15 }}
            transition={{ duration: 0.6, ease: [0.32, 0, 0.12, 1] }}
            className="absolute top-0 left-0 border-2 border-[#7c6df7]"
            style={{ transformOrigin: "center" }}
            onAnimationComplete={() => setAnimatingRing(false)}
          />
        )}

        {/* The Black Pill (Island) */}
        <motion.div
          animate={activeState}
          variants={variants}
          transition={{ duration: 0.42, ease: [0.32, 0, 0.12, 1] }}
          className={`bg-black text-white relative overflow-hidden shadow-2xl ${animatingBounce ? "animate-island-bounce" : ""}`}
          onAnimationEnd={() => setAnimatingBounce(false)}
          style={{ willChange: "width, height, border-radius" }}
        >
          <AnimatePresence mode="popLayout">
            {/* DEFAULT STATE */}
            {activeState === "default" && (
              <motion.div
                key="default"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2, delay: 0.1 }}
                className="w-full h-full flex items-center justify-between px-3"
              >
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 rounded-full bg-[#7c6df7]" />
                  <span className="font-['Syne'] font-bold text-xs tracking-tight">SkillExchange</span>
                </div>
              </motion.div>
            )}

            {/* CALL STATE */}
            {activeState === "call" && (
              <motion.div
                key="call"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2, delay: 0.2 }}
                className="w-full h-full flex items-center justify-between px-4"
              >
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center font-bold text-lg shadow-inner">
                    {payload?.avatarStr || "U"}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-['DM_Sans'] text-gray-400 font-medium uppercase tracking-wider mb-0.5 flex flex-row items-center gap-1.5">
                      <div className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
                      Incoming Skill Call
                    </span>
                    <span className="font-['Syne'] font-bold text-base leading-tight">
                      {payload?.name || "Video Call"}
                    </span>
                  </div>
                </div>
                <div className="flex flex-col gap-2 shrink-0">
                  <button 
                    onClick={() => { payload?.onAccept?.(); setActiveState("default"); }}
                    className="h-8 w-12 bg-green-500 hover:bg-green-600 rounded-full flex items-center justify-center transition-colors shadow-[0_0_15px_rgba(34,197,94,0.3)]"
                  >
                    <Check className="h-5 w-5 text-black stroke-[3]" />
                  </button>
                  <button 
                    onClick={() => { payload?.onDecline?.(); setActiveState("default"); }}
                    className="h-8 w-12 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center transition-colors"
                  >
                    <X className="h-5 w-5 text-white stroke-[3]" />
                  </button>
                </div>
              </motion.div>
            )}

            {/* MESSAGE STATE */}
            {activeState === "message" && (
              <motion.div
                key="message"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2, delay: 0.2 }}
                className="w-full h-full flex items-center px-4 gap-3 cursor-pointer"
                onClick={() => { payload?.onClick?.(); setActiveState("default"); }}
              >
                <div className="h-10 w-10 shrink-0 bg-[#7c6df7] rounded-[14px] flex items-center justify-center">
                  <Bell className="h-5 w-5 text-white fill-white/20" />
                </div>
                <div className="flex flex-col flex-1 min-w-0 justify-center">
                  <span className="text-[9px] font-['DM_Sans'] text-gray-400 font-medium tracking-widest uppercase">
                    SkillExchange
                  </span>
                  <span className="font-['Syne'] font-bold text-[14px] leading-tight truncate mt-0.5">
                    {payload?.title || "New Message"}
                  </span>
                  <span className="font-['DM_Sans'] text-xs text-gray-300 truncate mt-0.5 font-light">
                    {payload?.subtitle || "You have a new message waiting."}
                  </span>
                </div>
              </motion.div>
            )}

            {/* ALERT STATE */}
            {activeState === "alert" && (
              <motion.div
                key="alert"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2, delay: 0.2 }}
                className="w-full h-full flex items-center px-4 justify-between cursor-pointer"
                onClick={() => { payload?.onClick?.(); setActiveState("default"); }}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="h-10 w-10 shrink-0 bg-yellow-500/20 border border-yellow-500/30 rounded-[14px] flex items-center justify-center text-lg">
                    🏆
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="font-['Syne'] font-bold text-[13px] leading-tight truncate text-white">
                      {payload?.title || "Skill Match Found!"}
                    </span>
                    <span className="font-['DM_Sans'] text-[11px] text-[#7c6df7] truncate mt-0.5 font-medium">
                      {payload?.subtitle || "97% compatibility"}
                    </span>
                  </div>
                </div>
                <button 
                  onClick={(e) => { e.stopPropagation(); payload?.onClick?.(); setActiveState("default"); }}
                  className="shrink-0 bg-[#7c6df7] hover:bg-[#6857ea] transition-colors text-[11px] font-bold px-3 py-1.5 rounded-full ml-3 shadow-[0_0_10px_rgba(124,109,247,0.3)]"
                >
                  View
                </button>
              </motion.div>
            )}

            {/* LOGOUT STATE */}
            {activeState === "logout" && (
              <motion.div
                key="logout"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2, delay: 0.2 }}
                className="w-full h-full flex flex-row items-center justify-between px-4"
              >
                <div className="flex flex-col flex-1 pl-1">
                  <span className="text-[10px] font-['DM_Sans'] text-red-400 font-bold tracking-widest uppercase mb-0.5 mt-1">
                    Sign Out
                  </span>
                  <span className="font-['Syne'] font-bold text-[13px] text-white">
                    {payload?.subtitle || "Are you sure you want to leave?"}
                  </span>
                </div>
                <div className="flex flex-row gap-2 shrink-0">
                  <button 
                    onClick={() => { payload?.onAccept?.(); setActiveState("default"); }}
                    className="h-8 px-4 bg-red-500 hover:bg-red-600 rounded-full text-white font-bold text-xs transition-colors shadow-[0_0_15px_rgba(239,68,68,0.3)]"
                  >
                    Logout
                  </button>
                  <button 
                    onClick={() => { setActiveState("default"); }}
                    className="h-8 px-3 bg-gray-800 hover:bg-gray-700 text-white rounded-full text-xs font-bold transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}
