"use client";
import {
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  Background,
  BackgroundVariant, Connection,
  Controls, Edge, EdgeChange,
  MiniMap, NodeChange,
  ReactFlow,
  ReactFlowProvider,
  useReactFlow
} from "@xyflow/react";
import {DragEvent, useCallback, useRef, useState} from "react";
import '@xyflow/react/dist/style.css';
import TextNode from "@/components/TextNode";
import RectangleNode from "@/components/RectangleNode";
import CircleNode from "@/components/CircleNode";
import StarNode from "@/components/StarNode";
import DiamondNode from "@/components/DiamondNode";
import LineNode from "@/components/LineNode";
import Sidebar from "@/components/Sidebar";
import UserNode from "@/components/UserNode";
import CloudNode from "@/components/CloudNode";
import DatabaseNode from "@/components/DatabaseNode";
import ProcessNode from "@/components/ProcessNode";
import HexagonNode from "@/components/HexagonNode";
import CommentNode from "@/components/CommentNode";
import DecisionNode from "@/components/DecisionNode";
import TerminalNode from "@/components/TerminalNode";
import NoteNode from "@/components/NoteNode";

// Define node types
const nodeTypes = {
  textNode: TextNode,
  rectangleNode: RectangleNode,
  circleNode: CircleNode,
  starNode: StarNode,
  diamondNode: DiamondNode,
  lineNode: LineNode,
  userNode: UserNode,
  cloudNode: CloudNode,
  databaseNode: DatabaseNode,
  processNode: ProcessNode,
  hexagonNode: HexagonNode,
  commentNode: CommentNode,
  decisionNode: DecisionNode,
  terminalNode: TerminalNode,
  noteNode: NoteNode
};

// Main Flow Component
const FlowWithProvider = () => {
  return (
    <ReactFlowProvider>
      <Flow/>
    </ReactFlowProvider>
  );
};

const Flow = () => {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [nodes, setNodes] = useState([
    {
      id: 'n1',
      position: {x: 300, y: 100},
      data: {text: 'Sample Text Node'},
      type: 'textNode'
    },
    {
      id: 'n2',
      position: {x: 500, y: 200},
      data: {text: 'Rectangle'},
      type: 'rectangleNode'
    },
  ]);
  const [edges, setEdges] = useState([]);
  const {screenToFlowPosition} = useReactFlow();


  const onNodesChange = useCallback(
    (changes: NodeChange[]) => {
      setNodes((nodesSnapshot) => applyNodeChanges(changes, nodesSnapshot));
    },
    []
  );

  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) => {
      setEdges((edgesSnapshot) => applyEdgeChanges(changes, edgesSnapshot))
    },
    [],
  );

  const onConnect = useCallback(
    (params: Connection | Edge) => {
      setEdges((edgesSnapshot) =>
        addEdge({ ...params, animated: true }, edgesSnapshot)
      );
    },
    []
  );

  const onDragOver = useCallback((event: DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: DragEvent) => {
      event.preventDefault();

      const type = event.dataTransfer.getData('application/reactflow');

      if (typeof type === 'undefined' || !type) {
        return;
      }

      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      const newNode = {
        id: `${type}_${Date.now()}`,
        type,
        position,
        data: {
          text: type.charAt(0).toUpperCase() + type.slice(1).replace('Node', ''),
          rotation: 0
        },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [screenToFlowPosition],
  );

  return (
    <div className="h-screen w-screen flex">
      <Sidebar/>
      <div className="h-full w-full relative" ref={reactFlowWrapper}>
        <ReactFlow
          nodes={nodes}
          nodeTypes={nodeTypes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onDrop={onDrop}
          onDragOver={onDragOver}
          fitView
        >
          <Controls position="top-right"/>
          <MiniMap position="bottom-right"/>
          <Background variant={BackgroundVariant.Dots} gap={12} size={1}/>
        </ReactFlow>
      </div>
    </div>
  );
};

export default FlowWithProvider;