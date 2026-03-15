import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { JitsiMeeting } from '@jitsi/react-sdk';

const LiveClassroom = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const username = user.name || 'Guest Student';

  const handleClose = () => {
    if (user.role === 'tutor') {
      navigate('/tutor-dashboard');
    } else if (user.role === 'admin') {
      navigate('/admin/dashboard');
    } else {
      navigate('/dashboard');
    }
  };

  return (
    <div className="h-screen w-full bg-gray-900 flex flex-col">
      <div className="bg-primary-600 text-white p-4 flex justify-between items-center z-10">
        <h1 className="text-xl font-bold">TutorHub Live Classroom</h1>
        <button
          onClick={handleClose}
          className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded text-sm font-medium transition-colors"
        >
          Exit Class
        </button>
      </div>
      <div className="flex-grow relative">
        <JitsiMeeting
          domain="meet.jit.si"
          roomName={roomId || `TutorHub-Class-${Date.now()}`}
          configOverwrite={{
            startWithAudioMuted: true,
            disableThirdPartyRequests: true,
            prejoinPageEnabled: false,
            toolbarButtons: [
              'camera',
              'chat',
              'closedcaptions',
              'desktop',
              'download',
              'embedmeeting',
              'etherpad',
              'feedback',
              'filmstrip',
              'fullscreen',
              'hangup',
              'help',
              'invite',
              'livestreaming',
              'microphone',
              'mute-everyone',
              'mute-video-everyone',
              'participants-pane',
              'profile',
              'raisehand',
              'recording',
              'security',
              'select-background',
              'settings',
              'shareaudio',
              'sharedvideo',
              'shortcuts',
              'stats',
              'tileview',
              'toggle-camera',
              'videoquality',
              'whiteboard',
            ],
          }}
          interfaceConfigOverwrite={{
            DISABLE_JOIN_LEAVE_NOTIFICATIONS: true,
            SHOW_JITSI_WATERMARK: false,
            SHOW_WATERMARK_FOR_GUESTS: false,
          }}
          userInfo={{
            displayName: username
          }}
          onApiReady={(externalApi) => {
          }}
          getIFrameRef={(iframeRef) => {
            iframeRef.style.height = '100%';
            iframeRef.style.width = '100%';
            iframeRef.style.border = 'none';
          }}
        />
      </div>
    </div>
  );
};

export default LiveClassroom;
