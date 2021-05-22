import Web3 from "web3"; 
import TruffleContract from "@truffle/contract";
import electionTruffle from "../build/contracts/Election.json"

// @ts-ignore
const Election = TruffleContract(electionTruffle);

interface Candidate {
    owner: string; 
    id: number;
    tag: string;
    numVotes: number;
}

interface GetResponse {
    address: string;
    voteCount: number;
    candidateCount: number;
    candidates: Candidate[];
}

export async function get(web3: Web3, account: string): Promise<GetResponse> {
    Election.setProvider(web3.currentProvider); 
    const elect = await Election.deployed();

    const candidateCount = await elect.candidateCount();
    const count = candidateCount.toNumber(); 

    const voteCount = await elect.voteCount();

    const candidates: Candidate[] = [];
    for (let i = 1; i <= count; ++i) {
        const candidate = await elect.getCandidate(i);

        candidates.push({
            id: candidate.id.toNumber(),
            tag: candidate.tag, 
            numVotes: candidate.numVotes.toNumber(), 
            
            owner: candidate.owner,
        });
        console.log("api", candidate.numVotes.toNumber(), typeof(candidate.numVotes.toNumber()));
    }

    return {
        address: elect.address,
        voteCount: voteCount.toNumber(),
        candidateCount: candidateCount.toNumber(),
        candidates: candidates,
    };

}

export async function register(
    web3: Web3, 
    account: string,
    params: {
        tag: string;
    }
) {
    Election.setProvider(web3.currentProvider);
    const elect = await Election.deployed();
    await elect.register(params.tag, {
        from: account,
    });

}

export async function vote(
    web3: Web3,
    account: string,
    params: {
        id: number;
    }
) {
    Election.setProvider(web3.currentProvider);
    const elect = await Election.deployed();

    await elect.vote(params.id, {
        from: account,
    });
}

export function subscribe( 
    web3: Web3, 
    address: string, 
    callback: (error: Error | null, log: Log | null) => void
) {
    const election = new web3.eth.Contract(Election.abi, address);

    const res = election.events.allEvents((error: Error, log: Log) => {
        if (error) {
            callback(error, null); 
        } else if (log) {
            callback(null, log);
        }
    });

    return () => res.unsubscribe();
}

interface Register {
    event: "Register";
    returnValues: {
        owner: string;
        id: number;
        tag: string;
    };
}

interface Vote {
    event: "Vote";
    returnValues: {
        owner: string;
        id: number;
    }
}

type Log = 
    | Register
    | Vote
