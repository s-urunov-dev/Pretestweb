import { motion, AnimatePresence } from "motion/react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { Construction, Sparkles } from "lucide-react";
import { Button } from "./ui/button";

interface ComingSoonModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  message?: string;
}

export function ComingSoonModal({
  isOpen,
  onClose,
  title = "Coming Soon",
  message = "This feature is currently under development. Stay tuned!",
}: ComingSoonModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl text-[#182966]">
            {title}
          </DialogTitle>
          <DialogDescription className="sr-only">
            {message}
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col items-center justify-center py-8 px-4">
          {/* Animated Construction Icon */}
          <motion.div
            className="relative mb-6"
            animate={{
              rotate: [0, -10, 10, -10, 10, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatDelay: 1,
              ease: "easeInOut",
            }}
          >
            <div className="relative">
              <Construction className="h-20 w-20 text-[#182966]" />
              
              {/* Sparkles Animation */}
              <motion.div
                className="absolute -top-2 -right-2"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <Sparkles className="h-6 w-6 text-yellow-500" />
              </motion.div>
              
              <motion.div
                className="absolute -bottom-2 -left-2"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 0.5,
                }}
              >
                <Sparkles className="h-5 w-5 text-blue-500" />
              </motion.div>
            </div>
          </motion.div>

          {/* Animated Text */}
          <motion.p
            className="text-center text-[#182966]/70 mb-2 text-lg"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            {message}
          </motion.p>

          {/* Animated Progress Dots */}
          <motion.div
            className="flex gap-2 mb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="w-2 h-2 rounded-full bg-[#182966]"
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.3, 1, 0.3],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  delay: i * 0.2,
                  ease: "easeInOut",
                }}
              />
            ))}
          </motion.div>

          {/* Close Button */}
          <Button
            onClick={onClose}
            className="bg-[#182966] hover:bg-[#182966]/90 text-white rounded-full px-8"
          >
            Got it!
          </Button>
        </div>

        {/* Floating Background Circles */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-lg">
          <motion.div
            className="absolute top-10 right-10 w-20 h-20 rounded-full bg-[#182966]/5"
            animate={{
              scale: [1, 1.2, 1],
              x: [0, 10, 0],
              y: [0, -10, 0],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="absolute bottom-10 left-10 w-16 h-16 rounded-full bg-[#182966]/5"
            animate={{
              scale: [1, 1.3, 1],
              x: [0, -10, 0],
              y: [0, 10, 0],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}