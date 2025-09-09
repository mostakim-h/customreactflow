import {Card} from "@/components/ui/card";
import {
  Circle,
  Cloud,
  Cog,
  Database,
  Diamond,
  GitBranch,
  Hexagon,
  Minus,
  Power,
  Square,
  Star,
  StickyNote,
  Type,
  User,
} from "lucide-react";

const nodeOptions = [
  {type: "textNode", label: "Text Node", icon: Type, color: "bg-gray-50"},
  {type: "rectangleNode", label: "Rectangle", icon: Square, color: "bg-blue-50"},
  {type: "circleNode", label: "Circle", icon: Circle, color: "bg-green-50"},
  {type: "starNode", label: "Star", icon: Star, color: "bg-yellow-50"},
  {type: "diamondNode", label: "Diamond", icon: Diamond, color: "bg-purple-50"},
  {type: "lineNode", label: "Line", icon: Minus, color: "bg-red-50"},
  {type: "userNode", label: "User Node", icon: User, color: "bg-pink-50"},
  {type: "cloudNode", label: "Cloud Node", icon: Cloud, color: "bg-teal-50"},
  {type: "databaseNode", label: "Database Node", icon: Database, color: "bg-indigo-50"},
  {type: "processNode", label: "Process Node", icon: Cog, color: "bg-orange-50"},
  {type: "hexagonNode", label: "Hexagon Node", icon: Hexagon, color: "bg-cyan-50"},
  {type: "commentNode", label: "Comment Node", icon: StickyNote, color: "bg-lime-50"},
  {type: "decisionNode", label: "Decision Node", icon: GitBranch, color: "bg-amber-50"},
  {type: "terminalNode", label: "Terminal Node", icon: Power, color: "bg-fuchsia-50"},
  {type: "noteNode", label: "Note Node", icon: StickyNote, color: "bg-violet-50"},
];

export default function Sidebar() {
  return (
    <>
      <Card className="bg-white w-[15rem] h-full p-4 pointer-events-auto shadow-lg overflow-y-auto">
        <h3 className="text-lg font-semibold m-0 text-gray-800">Node Library</h3>
        <div className="space-y-2">
          {nodeOptions.map((option) => (
            <DraggableNode
              key={option.type}
              type={option.type}
              label={option.label}
              icon={option.icon}
              color={option.color}
            />
          ))}
        </div>
      </Card>
    </>
  )
}

// Draggable Node Component for Sidebar
const DraggableNode = ({type, label, icon: Icon, color}: any) => {
  const onDragStart = (event: DragEvent, nodeType: string) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div
      className={`flex items-center gap-3 p-3 ${color} border border-gray-300 rounded-lg cursor-grab active:cursor-grabbing hover:shadow-md transition-shadow`}
      onDragStart={(event) => onDragStart(event, type)}
      draggable
    >
      <Icon size={20} className="text-gray-700"/>
      <span className="text-sm font-medium text-gray-700">{label}</span>
    </div>
  );
};