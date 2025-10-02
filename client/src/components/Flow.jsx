import { useState, useCallback } from 'react';
import {
  ReactFlow,
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import ActionPopUpForm from './ActionPopUpForm';
import TriggerPopUpForm from './TriggerPopUpForm';

const initialNodes = [
  { id: 'n1', position: { x: 0, y: 0 }, data: { label: 'Airtable Trigger' } },
  { id: 'n2', position: { x: 0, y: 100 }, data: { label: 'Action' } },
];
const initialEdges = [{ id: 'n1-n2', source: 'n1', target: 'n2' }];

export default function Flow() {
  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState(initialEdges);
  const [openTriggerForm, setOpenTriggerForm] = useState(false);
  const [openActionForm, setOpenActionForm] = useState(false);
  const [actionData, setActionData] = useState(null);
  const [triggerData, setTriggerData] = useState(null);

  const onNodesChange = useCallback(
    (changes) =>
      setNodes((nodesSnapshot) => applyNodeChanges(changes, nodesSnapshot)),
    []
  );
  const onEdgesChange = useCallback(
    (changes) =>
      setEdges((edgesSnapshot) => applyEdgeChanges(changes, edgesSnapshot)),
    []
  );
  const onConnect = useCallback(
    (params) => setEdges((edgesSnapshot) => addEdge(params, edgesSnapshot)),
    []
  );
  const handleActionFormSubmit = (data) => {
    console.log('This is the action data', data);
    setOpenActionForm(false);
    setActionData(data);
  };
  const handleTriggerFormSubmit = (data) => {
    console.log('This is the trigger data', data);
    setOpenTriggerForm(false);
    setTriggerData(data);
  };
  const publishWorkflow = () => {
    console.log('Publishing workflow');
  }

  return (
    <>
      <div style={{ width: '100vw', height: '100vh' }}>
        <button
          onClick={publishWorkflow}
          disabled={!actionData || !triggerData}
          style={{
            position: 'absolute',
            top: '90px',
            right: '50px',
            zIndex: 10,
            padding: '10px 20px',
            backgroundColor: '#0066cc',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            fontSize: '14px',
            fontWeight: '500',
            cursor: (actionData && triggerData) ? 'pointer' : 'not-allowed',
            opacity: (actionData && triggerData) ? 1 : 0.6,
          }}
        >
          Publish
        </button>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeClick={(event, node) => {
            if (node.id === 'n1') {
              setOpenTriggerForm(true);
            } else if (node.id === 'n2') {
              setOpenActionForm(true);
            }
          }}
          fitView
        />
      </div>
      {openTriggerForm && (
        <TriggerPopUpForm onClose={handleTriggerFormSubmit} />
      )}
      {openActionForm && <ActionPopUpForm onClose={handleActionFormSubmit} />}
    </>
  );
}
