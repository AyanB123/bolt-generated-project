import React, { useState, useEffect } from 'react';
    import Voice from 'react-native-voice';

    const App = () => {
      const [isRecording, setIsRecording] = useState(false);
      const [transcript, setTranscript] = useState([]);
      const [elapsedTime, setElapsedTime] = useState(0);
      const [darkMode, setDarkMode] = useState(false);
      const [audioFile, setAudioFile] = useState(null);

      useEffect(() => {
        Voice.onSpeechStart = onSpeechStart;
        Voice.onSpeechEnd = onSpeechEnd;
        Voice.onSpeechResults = onSpeechResults;
        Voice.onSpeechError = onSpeechError;

        return () => {
          Voice.destroy().then(Voice.removeAllListeners);
        };
      }, []);

      const onSpeechStart = (e) => {
        console.log('onSpeechStart:', e);
      };

      const onSpeechEnd = (e) => {
        console.log('onSpeechEnd:', e);
        setIsRecording(false);
      };

      const onSpeechResults = (e) => {
        console.log('onSpeechResults:', e);
        const newTranscript = e.value.map((result, index) => ({
          time: formatTime(elapsedTime + index * 5),
          text: result,
        }));
        setTranscript((prevTranscript) => [...prevTranscript, ...newTranscript]);
      };

      const onSpeechError = (e) => {
        console.log('onSpeechError:', e);
        setIsRecording(false);
      };

      const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
      };

      const startRecording = async () => {
        try {
          await Voice.start('en-US');
          setIsRecording(true);
        } catch (error) {
          console.error('Error starting recording:', error);
        }
      };

      const stopRecording = async () => {
        try {
          await Voice.stop();
          setIsRecording(false);
          setElapsedTime(0);
        } catch (error) {
          console.error('Error stopping recording:', error);
        }
      };

      const toggleDarkMode = () => {
        setDarkMode((prevMode) => !prevMode);
      };

      const handleFileUpload = (event) => {
        const file = event.target.files[0];
        setAudioFile(file);
        // Implement actual file upload and transcription logic here
      };

      return (
        <div className={darkMode ? 'dark-mode' : 'light-mode'}>
          <div className="container">
            <div className="controls">
              {!isRecording ? (
                <button onClick={startRecording}>Start</button>
              ) : (
                <button onClick={stopRecording}>Stop</button>
              )}
              <button onClick={toggleDarkMode}>
                {darkMode ? 'Light Mode' : 'Dark Mode'}
              </button>
            </div>
            <div className="transcript">
              {transcript.map((segment, index) => (
                <div key={index} className="transcript-segment">
                  <time>{segment.time}</time>
                  <span>{segment.text}</span>
                </div>
              ))}
            </div>
            <div className="file-upload">
              <input type="file" id="audioFile" accept="audio/*" onChange={handleFileUpload} />
              <label htmlFor="audioFile">Upload Audio File</label>
            </div>
          </div>
        </div>
      );
    };

    export default App;
