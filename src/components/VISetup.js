import TextToSpeech from './TextToSpeech';

const VISetup = () => {
  const text = [
    "Welcome to One4All, a mobile banking application with accessibility solutions as a priority. Please use your arrow keys to interact with the setup options. To pause the speech, press left, to stop the speech, press down, and to begin playing the speech again, press up. To replay the last section you heard, press the right arrow key. Once you are happy with these options, please press the control key next to the left arrow."
    , "Great. Now we're going to adjust the speech to your preference. To do this, we need to use the shift key alongside the left and right arrow keys to sift through the options; once you have found a voice you like, press the control arrow again.", "Thanks. Now we'll adjust the pitch of the voice, using the left and right arrows as before. Press control when you're happy with the result.", "Now, we'll adjust the speed of the voice.", "Finally, we'll adjust the volume of the voice. Once you're happy with this, press the control button and we'll log you in." ];

  return (
    <div>
      <h1>Visually impaired user set up</h1>
      <TextToSpeech textList={text} />
      <p>{text}</p>
    </div>
  );
};

export default VISetup;