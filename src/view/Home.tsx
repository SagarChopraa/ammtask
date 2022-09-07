import Navbar from "./Navbar"
import styled from "styled-components"

const Home = () => {
  return (
    <>
      <Navbar />
      <HomeContainerMain>
        <HomeHeading>
          The moon is made of pancakes.
        </HomeHeading>
        <HomeContent>
          Trade, earn, and win crypto on the most popular decentralized platform in the galaxy.
        </HomeContent>
        <Button>Trade Now</Button>
      </HomeContainerMain>
    </>
  )
}

export default Home

const HomeContainerMain = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 80%;
  margin: auto;
`;

const HomeHeading = styled.div`
  color: white;
  font-weight: bolder;
  font-size: 30px;
`;

const HomeContent = styled.div`
  font-weight: 100;
  color: white;
  font-size: 16px;
`;

const Button = styled.div`
    font-size: 30px;
    text-decoration: none;
    width: 12%;
    color: rgb(255, 255, 255);
    padding: 5px;
    margin: 10px 0px;
    background-color: transparent;
    border: 2px solid rgb(69, 87, 87);
    transition: all 0.5s linear 0s;
    cursor: pointer;

    :hover{
      color: rgb(255, 255, 255);
      opacity: 0.8;
      box-shadow: rgb(235 218 134) 5px 5px;
    }
`;