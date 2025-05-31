import "./App.css";
import Chat from "./components/Chat/Chat";
// import Form from "./components/Form/Form";
// import Overlay from "./components/Overlay/Overlay";
import Section from "./components/Section/Section";

function App() {
  return (
    <div className="app">
      <Section title={"Title"}>
        <Chat></Chat>
      </Section>
      {/* <Overlay isOpened={true}>
      </Overlay> */}
    </div>
  );
}

export default App;
