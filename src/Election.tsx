import React from "react";
import { useElectionContext } from "./contexts/Election";
import RegisterForm from "./RegisterForm";
import CandidateList from "./CandidateList";
function Election() {
    const { state } = useElectionContext();

    return (
        <div>
            <div>Vote Count: {state.voteCount}</div>
            <div>Candidate Count: {state.candidateCount}</div>
            <RegisterForm />
            <CandidateList data={state.candidates} count={state.candidateCount}/>
        </div>
    );
}

export default Election;