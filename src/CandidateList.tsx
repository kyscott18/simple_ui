import React from "react";
import { Button } from "semantic-ui-react";
import { vote } from "./api/election";
import useAsync from "./components/useAsync";
import Web3 from "web3";
import { useWeb3Context } from "./contexts/Web3";

interface Candidate {
    owner: string;
    id: number;
    tag: string;
    numVotes: number;
}

interface Props {
    count: number;
    data: Candidate[];
}

interface VoteParams {
    web3: Web3; 
    account: string; 
    id: number;
}

const CandidateList: React.FC<Props> = ({
    count, data
}) => {
    const {
        state: { web3, account },
    } = useWeb3Context(); 

    const {pending, call} = useAsync<VoteParams, void>(
        ({web3, account, id}) => vote(web3, account, { id })
    );


    async function onClick(id: number) {
        if (pending) {
            return; 
        }

        if (!web3) {
            alert("No web3");
            return;
        }

        const { error } = await call({
            web3,
            account, 
            id,
        });

        if (error) {
            alert(`Error: ${error.message}`);
        }
    }
    return (
        <ul>
            {data.map((c, i) => (
                <li key = {c.id}>
                    <div>Candidate Address: {c.owner}</div>
                    <div>Candidate ID: {c.id}</div>
                    <div>Candidate tag: {c.tag}</div>
                    <div>Candidate Vote Count: {c.numVotes}</div>
                    {console.log("list", c.numVotes, typeof(c.numVotes))}
                    <Button onClick={() => onClick(c.id)}
                    >
                        Vote
                    </Button>
                </li>
            ))}
        </ul>
    );
};

export default CandidateList;