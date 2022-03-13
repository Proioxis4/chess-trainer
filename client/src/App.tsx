import { Route, Routes } from "react-router-dom";
import NavBar from "./components/NavBar";
import styled from "styled-components";
import Board from "./components/Board";
function Index() {
  return <h2>prova</h2>;
}

function App() {
  return (
    <>
      <Styles.Wrapper>
        <NavBar />
      </Styles.Wrapper>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/play" element={<Board />} />
      </Routes>
    </>
  );
}

const Styles = {
  Wrapper: styled.main`
    display: flex;
    background-color: #eeeeee;
    height: 100vh;
  `,
};
export default App;
