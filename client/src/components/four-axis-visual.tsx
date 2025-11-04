import { motion } from "framer-motion";

interface FourAxisVisualProps {
  scores: {
    structureOrientation: number;
    motivationStyle: number;
    cognitiveFocus: number;
    taskRelationship: number;
  };
}

export function FourAxisVisual({ scores }: FourAxisVisualProps) {
  const axes = [
    {
      key: "structureOrientation",
      label: "Structure Orientation",
      lowLabel: "Flexible Improviser",
      highLabel: "System-Driven Planner",
      color: "from-purple-500 to-indigo-500",
      bgColor: "bg-purple-50",
    },
    {
      key: "motivationStyle",
      label: "Motivation Style",
      lowLabel: "Self-Driven Meaning Seeker",
      highLabel: "Accountability-Based Achiever",
      color: "from-blue-500 to-cyan-500",
      bgColor: "bg-blue-50",
    },
    {
      key: "cognitiveFocus",
      label: "Cognitive Focus",
      lowLabel: "Expansive Idea Generator",
      highLabel: "Precision-Focused Executor",
      color: "from-teal-500 to-green-500",
      bgColor: "bg-teal-50",
    },
    {
      key: "taskRelationship",
      label: "Task Relationship",
      lowLabel: "Pressure Responder",
      highLabel: "Immersion Seeker",
      color: "from-orange-500 to-pink-500",
      bgColor: "bg-orange-50",
    },
  ];

  return (
    <div className="space-y-8 w-full">
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold text-neutral-800 mb-2">
          Your 4-Axis Productivity Profile
        </h3>
        <p className="text-neutral-600">
          Each axis reveals how your brain naturally approaches work
        </p>
      </div>

      <div className="space-y-6">
        {axes.map((axis, index) => {
          const score = scores[axis.key as keyof typeof scores] ?? 50;
          const percentage = Math.max(0, Math.min(100, score));

          return (
            <motion.div
              key={axis.key}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="space-y-3"
            >
              {/* Axis Label */}
              <div className="flex justify-between items-center">
                <h4 className="text-sm font-bold text-neutral-700 uppercase tracking-wide">
                  {axis.label}
                </h4>
                <span className="text-2xl font-bold text-neutral-800">
                  {Math.round(percentage)}
                </span>
              </div>

              {/* Visual Bar */}
              <div className={`relative h-16 rounded-xl overflow-hidden ${axis.bgColor}`}>
                {/* Background gradient bar */}
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${percentage}%` }}
                  transition={{ delay: index * 0.1 + 0.2, duration: 0.8, ease: "easeOut" }}
                  className={`absolute top-0 left-0 h-full bg-gradient-to-r ${axis.color} opacity-80`}
                />

                {/* Marker dot */}
                <motion.div
                  initial={{ left: "0%" }}
                  animate={{ left: `${percentage}%` }}
                  transition={{ delay: index * 0.1 + 0.2, duration: 0.8, ease: "easeOut" }}
                  className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-6 h-6 bg-white rounded-full shadow-lg border-4 border-current"
                  style={{
                    borderColor: `rgb(${axis.color.includes('purple') ? '139, 92, 246' : 
                                  axis.color.includes('blue') ? '59, 130, 246' : 
                                  axis.color.includes('teal') ? '20, 184, 166' : 
                                  '249, 115, 22'})`,
                  }}
                />

                {/* Low/High Labels */}
                <div className="absolute inset-0 flex items-center justify-between px-4 pointer-events-none">
                  <span className="text-xs font-medium text-neutral-600 max-w-[40%] leading-tight">
                    {axis.lowLabel}
                  </span>
                  <span className="text-xs font-medium text-neutral-600 max-w-[40%] text-right leading-tight">
                    {axis.highLabel}
                  </span>
                </div>
              </div>

              {/* Percentage indicator */}
              <div className="flex justify-between items-center text-xs text-neutral-500">
                <span>0</span>
                <span className="font-semibold text-neutral-700">
                  {percentage < 40 ? "Low" : percentage < 60 ? "Moderate" : "High"}
                </span>
                <span>100</span>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Interpretation Guide */}
      <div className="mt-8 p-6 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl border border-indigo-100">
        <div className="flex items-start space-x-3">
          <div className="text-2xl">📊</div>
          <div>
            <h4 className="font-bold text-neutral-800 mb-2">Understanding Your Profile</h4>
            <p className="text-sm text-neutral-700 leading-relaxed">
              These four dimensions form your unique productivity DNA. Your position on each axis reveals strengths to leverage and challenges to navigate. There's no "perfect" score—only what works for you.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
