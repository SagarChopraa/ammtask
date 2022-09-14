import { useState } from "react";
import Navbar from "../Navbar"
import styled from "styled-components"
import AddLiquidity from "./AddLiquidity";
import { RemoveLiquidity } from "./RemoveLiquidity";

const Liquidity = () => {
  const [active, setActive] = useState("add");

  return (
    <>
      <Navbar />
      <LiquidityContainerMain>
        <LiquidityOuterDiv>
          <LiquidityInterDiv>
            <HeadingButtonDiv>
              <AddHeading onClick={() => setActive("add")} active={active === "add"}>ADD</AddHeading>
              <RemoveHeading onClick={() => setActive("remove")} active={active === "remove"}>Remove</RemoveHeading>
            </HeadingButtonDiv>
            {active === "add" && (
                <AddLiquidity />
            )}
            {active === "remove" && (
                <RemoveLiquidity />
            )}
          </LiquidityInterDiv>
        </LiquidityOuterDiv>
      </LiquidityContainerMain>
    </>
  )
}

export default Liquidity;

const LiquidityContainerMain = styled.div`
    display: flex;
    -webkit-box-pack: center;
    justify-content: center;
`;

const LiquidityOuterDiv = styled.div`
    max-width: 420px;
    width: 100%;
    background: rgb(255, 253, 250);
    box-shadow: rgb(0 0 0 / 1%) 0px 0px 1px, rgb(0 0 0 / 4%) 0px 4px 8px, rgb(0 0 0 / 4%) 0px 16px 24px, rgb(0 0 0 / 1%) 0px 24px 32px;
    border-radius: 20px;
    padding: 1rem;
    margin: 40px 0px;
`;

const LiquidityInterDiv = styled.div`
    display: flex;
    flex-direction: column;
`;

const HeadingButtonDiv = styled.div`
    display: flex;
    flex-direction: row;
    -webkit-box-pack: center;
    justify-content: center;
`;

const AddHeading = styled.div<{ active: boolean }>`
    background: ${(props) =>
		props.active
			? `orange`
			: "grey"};
    box-shadow: rgb(0 0 0 / 1%) 0px 0px 1px, rgb(0 0 0 / 4%) 0px 4px 8px, rgb(0 0 0 / 4%) 0px 16px 24px, rgb(0 0 0 / 1%) 0px 24px 32px;
    border-radius: 10px;
    padding: 0.5rem;
    margin: 0px 10px;
    cursor: pointer;
`;

const RemoveHeading = styled.div<{ active: boolean }>`
    background: ${(props) =>
		props.active
			? `orange`
			: "grey"};
    box-shadow: rgb(0 0 0 / 1%) 0px 0px 1px, rgb(0 0 0 / 4%) 0px 4px 8px, rgb(0 0 0 / 4%) 0px 16px 24px, rgb(0 0 0 / 1%) 0px 24px 32px;
    border-radius: 10px;
    padding: 0.5rem;
    margin: 0px 10px;
    cursor: pointer;
`;


