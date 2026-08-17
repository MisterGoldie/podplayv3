import { Button } from "~/components/ui/Button";
import { Context } from "@farcaster/miniapp-sdk";
import { motion } from "framer-motion";

interface HomePageProps {
  frameContext?: Context.MiniAppContext;
  profileImage?: string | null;
  onPlayClick: () => void;
}

export default function HomePage({
  frameContext,
  profileImage,
  onPlayClick,
}: HomePageProps) {
  return (
    <motion.div
      className="w-full h-full flex flex-col items-center justify-center px-4"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        type: "spring",
        stiffness: 100,
        damping: 15,
        duration: 0.8,
      }}
    >
      {profileImage && (
        <motion.div
          className="relative mb-5"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-purple-800 rounded-full blur-md" />
          <img
            src={profileImage}
            alt="Profile"
            className="relative w-20 h-20 rounded-full object-cover border-2 border-purple-400/30 shadow-[0_0_15px_rgba(168,85,247,0.5)]"
          />
        </motion.div>
      )}

      {frameContext?.user?.username && (
        <motion.div
          className="text-white text-lg mb-6 text-shadow text-center"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.4, ease: "easeOut" }}
        >
          Welcome, {frameContext.user.username}
        </motion.div>
      )}

      <motion.h1
        className="text-3xl font-bold text-center text-white mb-6 text-shadow"
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{
          delay: 0.4,
          type: "spring",
          stiffness: 150,
          damping: 10,
        }}
      >
        SELECT GAME
      </motion.h1>

      <motion.div
        className="relative w-full max-w-[300px]"
        initial={{ scale: 0.3, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{
          delay: 0.5,
          type: "spring",
          stiffness: 200,
          damping: 15,
        }}
        whileHover={{
          scale: 1.05,
          transition: { type: "spring", stiffness: 400, damping: 10 },
        }}
        whileTap={{
          scale: 0.95,
          transition: { duration: 0.1 },
        }}
      >
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-purple-600 to-purple-800 rounded-xl blur-md -rotate-1"
          animate={{
            rotate: [-2, 2, -2],
            scale: [1, 1.02, 1],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
            repeatType: "reverse",
          }}
        />
        <Button
          onClick={onPlayClick}
          className="relative w-full py-6 text-3xl font-black bg-gradient-to-r from-purple-500 to-purple-700 hover:from-purple-600 hover:to-purple-800 rounded-xl border-2 border-purple-400/30 shadow-[0_0_15px_rgba(168,85,247,0.5)]"
        >
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-purple-100">
            Tic-Tac-Toe
          </span>
        </Button>
      </motion.div>
    </motion.div>
  );
}
