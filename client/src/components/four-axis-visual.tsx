import { motion } from "framer-motion";
import { Lightbulb, BarChart3 } from "lucide-react";

interface FourAxisVisualProps {
  scores: {
    structureOrientation: number;
    motivationStyle: number;
    cognitiveFocus: number;
    taskRelationship: number;
  };
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

function getPercentileContext(score: number): string {
  const percentileBelow = score;
  if (percentileBelow < 30) {
    return `${100 - percentileBelow}% of people score higher`;
  } else if (percentileBelow > 70) {
    return `You're in the top ${100 - percentileBelow}% for this trait`;
  } else {
    return `You're in the middle 40% — a balanced approach`;
  }
}

export function FourAxisVisual({ scores }: FourAxisVisualProps) {
  const axes = [
    {
      key: "structureOrientation",
      label: "Structure Orientation",
      color: "#14B8A6", // Teal
      bgColor: "bg-teal-50",
    },
    {
      key: "motivationStyle",
      label: "Motivation Style",
      color: "#F43F5E", // Rose
      bgColor: "bg-rose-50",
    },
    {
      key: "cognitiveFocus",
      label: "Cognitive Focus",
      color: "#F59E0B", // Amber
      bgColor: "bg-amber-50",
    },
    {
      key: "taskRelationship",
      label: "Task Relationship",
      color: "#A855F7", // Purple
      bgColor: "bg-purple-50",
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
          These four traits shape how you work best
        </p>
      </motion.div>

      <div className="space-y-5">
        {axes.map((axis, index) => {
          const score = scores[axis.key as keyof typeof scores] ?? 50;
          const percentage = Math.max(0, Math.min(100, score));
          const insight = getInsight(axis.key, percentage);
          const context = getPercentileContext(percentage);

          return (
            <motion.div
              key={axis.key}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.4 }}
              className={`p-5 rounded-xl ${axis.bgColor} border border-gray-100`}
            >
              {/* Header: Axis Name + Score */}
              <div className="flex justify-between items-center mb-3">
                <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                  {axis.label}
                </h4>
                <span 
                  className="text-2xl font-bold"
                  style={{ color: axis.color }}
                >
                  {Math.round(percentage)}
                </span>
              </div>

              {/* Progress Bar */}
              <div className="relative h-6 bg-gray-200 rounded-full overflow-hidden mb-4">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${percentage}%` }}
                  transition={{ delay: index * 0.1 + 0.2, duration: 0.7, ease: "easeOut" }}
                  className="absolute top-0 left-0 h-full rounded-full"
                  style={{ backgroundColor: axis.color }}
                />
              </div>

              {/* Insight */}
              <div className="flex items-start gap-2 mb-2">
                <Lightbulb className="w-4 h-4 mt-0.5 flex-shrink-0 text-amber-500" />
                <p className="text-sm text-gray-700 font-medium">
                  {insight}
                </p>
              </div>

              {/* Context */}
              <div className="flex items-start gap-2">
                <BarChart3 className="w-4 h-4 mt-0.5 flex-shrink-0 text-blue-500" />
                <p className="text-sm text-gray-500">
                  {context}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
