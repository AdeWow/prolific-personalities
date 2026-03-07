import { motion } from "framer-motion";
import { Lightbulb } from "lucide-react";

interface FourAxisVisualProps {
  scores: {
    structureOrientation: number;
    motivationStyle: number;
    cognitiveFocus: number;
    taskRelationship: number;
  };
}

// Normalize raw quiz scores (7-35) to 0-100 for display
function normalizeScore(raw: number): number {
  const min = 7;
  const max = 35;
  const normalized = ((raw - min) / (max - min)) * 100;
  return Math.max(0, Math.min(100, Math.round(normalized)));
}

function getInsight(axis: string, score: number): string {
  switch (axis) {
    case "structureOrientation":
      if (score <= 30) return "You thrive with flexibility and spontaneity";
      if (score <= 70) return "You balance structure with adaptability";
      return "You excel with clear systems and routines";
    case "motivationStyle":
      if (score <= 30) return "You're driven by intrinsic meaning and purpose";
      if (score <= 70) return "You balance internal drive with external goals";
      return "You excel with clear goals and accountability";
    case "cognitiveFocus":
      if (score <= 30) return "Your strength is expansive, creative thinking";
      if (score <= 70) return "You balance big-picture vision with execution";
      return "You excel at focused, detail-oriented work";
    case "taskRelationship":
      if (score <= 30) return "You perform best under pressure and urgency";
      if (score <= 70) return "You balance quick wins with deep immersion";
      return "You thrive with extended focus time";
    default:
      return "";
  }
}


export function FourAxisVisual({ scores }: FourAxisVisualProps) {
  const axes = [
    {
      key: "structureOrientation",
      label: "Structure Orientation",
      color: "#14B8A6", // Teal
      bgColor: "bg-teal-50",
      leftLabel: "Flexibility",
      rightLabel: "Structure",
    },
    {
      key: "motivationStyle",
      label: "Motivation Style",
      color: "#F43F5E", // Rose
      bgColor: "bg-rose-50",
      leftLabel: "Intrinsic",
      rightLabel: "External",
    },
    {
      key: "cognitiveFocus",
      label: "Cognitive Focus",
      color: "#F59E0B", // Amber
      bgColor: "bg-amber-50",
      leftLabel: "Creative / Expansive",
      rightLabel: "Analytical / Focused",
    },
    {
      key: "taskRelationship",
      label: "Task Relationship",
      color: "#A855F7", // Purple
      bgColor: "bg-purple-50",
      leftLabel: "Reactive / Urgent",
      rightLabel: "Planned / Methodical",
    },
  ];

  return (
    <div className="space-y-6 w-full">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-8"
      >
        <h3 className="text-2xl font-bold text-foreground mb-2">
          Your Productivity DNA
        </h3>
        <p className="text-muted-foreground">
          These four dimensions show where you naturally land — not a grade, just your working style.
        </p>
      </motion.div>

      <div className="space-y-5">
        {axes.map((axis, index) => {
          const raw = scores[axis.key as keyof typeof scores] ?? 21;
          const percentage = normalizeScore(raw);
          const insight = getInsight(axis.key, percentage);

          return (
            <motion.div
              key={axis.key}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.4 }}
              className={`p-5 rounded-xl ${axis.bgColor} border border-gray-100`}
            >
              {/* Axis Name */}
              <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-4">
                {axis.label}
              </h4>

              {/* Spectrum Bar */}
              <div className="relative mb-2">
                {/* Track */}
                <div className="relative h-2.5 rounded-full overflow-hidden bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200">
                  {/* Subtle color tint on the track */}
                  <div
                    className="absolute inset-0 rounded-full opacity-20"
                    style={{
                      background: `linear-gradient(to right, ${axis.color}33, ${axis.color}11, ${axis.color}33)`,
                    }}
                  />
                </div>

                {/* Marker */}
                <motion.div
                  initial={{ left: "50%", opacity: 0, scale: 0 }}
                  animate={{ left: `${percentage}%`, opacity: 1, scale: 1 }}
                  transition={{
                    left: { delay: index * 0.1 + 0.2, duration: 0.7, ease: "easeOut" },
                    opacity: { delay: index * 0.1 + 0.1, duration: 0.3 },
                    scale: { delay: index * 0.1 + 0.1, duration: 0.4, ease: "backOut" },
                  }}
                  className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2"
                  style={{ left: `${percentage}%` }}
                >
                  <div
                    className="w-5 h-5 rounded-full border-[3px] border-white shadow-md"
                    style={{ backgroundColor: axis.color }}
                  />
                </motion.div>
              </div>

              {/* Endpoint Labels */}
              <div className="flex justify-between items-start mt-1 mb-4">
                <span className="text-xs text-gray-500 font-medium leading-tight max-w-[40%]">
                  {axis.leftLabel}
                </span>
                <span className="text-xs text-gray-500 font-medium text-right leading-tight max-w-[40%]">
                  {axis.rightLabel}
                </span>
              </div>

              {/* Insight */}
              <div className="flex items-start gap-2">
                <Lightbulb className="w-4 h-4 mt-0.5 flex-shrink-0 text-amber-500" />
                <p className="text-sm text-gray-700 font-medium">
                  {insight}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
