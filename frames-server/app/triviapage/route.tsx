// pages/frames/trivia/route.ts

import { createFrames, Button } from "frames.js/next";
import { web3Trivia, TriviaQuestion } from "../../util/trivia";
import axios from "axios";
import { BASE_URL } from "@/lib/constants";
import { getFrameMessage } from "frames.js";
import { getPreviousFrame } from "frames.js/next/server";
import { isXmtpFrameActionPayload, getXmtpFrameMessage } from "frames.js/xmtp";

// Environment variables
const CHATBOT_API_URL = process.env.CHATBOT_API_URL;
const CHATBOT_API_KEY = process.env.CHATBOT_API_KEY;

// In-memory storage for current trivia session
interface TriviaSession {
    question: TriviaQuestion;
    timeout: NodeJS.Timeout;
}

const frames = createFrames();

const activeTrivia: { [key: string]: TriviaSession } = {};

const handleRequest = frames(async (ctx) => {
    // Check if an active trivia session exists
    //   if (activeTrivia[ctx.sender.fid]) {
    //     // User is already in an active trivia session
    //     return {
    //       image: (
    //         <div style={styles.container}>
    //           <h1 style={styles.title}>Trivia in Progress</h1>
    //           <p style={styles.text}>Please wait for the current trivia to finish.</p>
    //         </div>
    //       ),
    //       buttons: [],
    //     };
    //   }

    const sessionId = generateSessionId();

    // Start a new trivia session
    const randomQuestion = web3Trivia[Math.floor(Math.random() * web3Trivia.length)];
    // activeTrivia[sessionId] = {
    //     question: randomQuestion,
    //     timeout: setTimeout(() => {
    //         // Timeout handler
    //         delete activeTrivia[sessionId];
    //         ctx.send({
    //             image: (
    //                 <div style={styles.container}>
    //                     <h1 style={styles.title}>⏳ Time's Up!</h1>
    //                     <p style={styles.text}>No one answered correctly. Better luck next time!</p>
    //                 </div>
    //             ),
    //             buttons: [],
    //         });
    //     }, 30000), // 30 seconds
    // };

    // const questionText = `${randomQuestion.question}\n\nA) ${randomQuestion.options.A}\nB) ${randomQuestion.options.B}\nC) ${randomQuestion.options.C}\nD) ${randomQuestion.options.D}\n\n*Please answer with A, B, C, or D within 30 seconds!*`;

    return {
        accepts: [
            {
                id: "farcaster",
                version: "vNext",
            },
            {
                id: "xmtp",
                version: "vNext",
            },
        ],
        image: (
            <div style={styles.container}>
                {/* <h1 style={styles.title}>{questionText}</h1> */}
                <p style={styles.question}>{randomQuestion.question}</p>

                {/* Styling each answer option separately */}
                <div style={styles.options}>
                    <p style={styles.option}>A) {randomQuestion.options.A}</p>
                    <p style={styles.option}>B) {randomQuestion.options.B}</p>
                    <p style={styles.option}>C) {randomQuestion.options.C}</p>
                    <p style={styles.option}>D) {randomQuestion.options.D}</p>
                </div>

                <p style={styles.instruction}>*Please answer with A, B, C, or D within 30 seconds!*</p>
            </div>
        ),
        buttons: [
            // Button({
            //     action: "post",
            //     children: "A",
            //     target: "/?answer=A"
            // }),
            // Button({
            //     action: "post",
            //     children: "B",
            //     target: "/?answer=B"
            // }),
            // Button({
            //     action: "post",
            //     children: "C",
            //     target: "/?answer=C"
            // }),
            // Button({
            //     action: "post",
            //     children: "D",
            //     target: "/?answer=D"
            // }),
            // <Button action="post" target={`${BASE_URL}/triviapage?answer=A&session=${sessionId}`}>A</Button>,
            // <Button action="post" target={`${BASE_URL}/triviapage?answer=B&session=${sessionId}`}>B</Button>,
            // <Button action="post" target={`${BASE_URL}/triviapage?answer=C&session=${sessionId}`}>C</Button>,
            // <Button action="post" target={`${BASE_URL}/triviapage?answer=D&session=${sessionId}`}>D</Button>,
            // new URL(`/triviapage?answer=A&session=${sessionId}`, BASE_URL);
            <Button key="A" action="post" target={`${new URL(`/triviapage?answer=A&session=${sessionId}`, BASE_URL).toString()}`}>A</Button>,
            <Button key="B" action="post" target={`${new URL(`/triviapage?answer=B&session=${sessionId}`, BASE_URL).toString()}`}>B</Button>,
            <Button key="C" action="post" target={`${new URL(`/triviapage?answer=C&session=${sessionId}`, BASE_URL).toString()}`}>C</Button>,
            <Button key="D" action="post" target={`${new URL(`/triviapage?answer=D&session=${sessionId}`, BASE_URL).toString()}`}>D</Button>
        ],
    };
});

// POST handler to process answers
const postHandler = frames(async (ctx) => {
    console.log("test");

    const body = await ctx.request.json();
    console.log(body);
    const sessionid = ctx.searchParams.session;
    const previousFrame = getPreviousFrame(ctx.searchParams);

    // do some logic to determine the next frame

    let fid: number | undefined;
    let walletAddress: string | undefined;

    if (isXmtpFrameActionPayload(body)) {
        const { verifiedWalletAddress } = await getXmtpFrameMessage(body);
        walletAddress = verifiedWalletAddress;
    }

    if (
        previousFrame.postBody &&
        isXmtpFrameActionPayload(previousFrame.postBody)
    ) {
        console.log('test');
        const frameMessage = await getXmtpFrameMessage(previousFrame.postBody);
        walletAddress = frameMessage?.verifiedWalletAddress;
        // do something with XMTP frame message
    } else {
        console.log("frame");
        return {
            accepts: [
                {
                    id: "farcaster",
                    version: "vNext",
                },
                {
                    id: "xmtp",
                    version: "vNext",
                },
            ],
            image: (
                <div style={styles.container}>
                    <h1 style={styles.title}>Not XMTP</h1>
                    <p style={styles.text}>Invalid request.</p>
                </div>
            ),
            buttons: [],
        };
    }


    if (!sessionid || !activeTrivia[sessionid]) {
        // No active trivia session
        return {
            accepts: [
                {
                    id: "farcaster",
                    version: "vNext",
                },
                {
                    id: "xmtp",
                    version: "vNext",
                },
            ],
            image: (
                <div style={styles.container}>
                    <h1 style={styles.title}>No Active Trivia</h1>
                    <p style={styles.text}>Start a new trivia session by triggering the trivia command again.</p>
                </div>
            ),
            buttons: [],
        };
    }

    const answer = ctx.searchParams.answer.toUpperCase();

    if (!answer || !['A', 'B', 'C', 'D'].includes(answer)) {
        return {
            accepts: [
                {
                    id: "farcaster",
                    version: "vNext",
                },
                {
                    id: "xmtp",
                    version: "vNext",
                },
            ],
            image: (
                <div style={styles.container}>
                    <h1 style={styles.title}>Invalid Answer</h1>
                    <p style={styles.text}>Please respond with A, B, C, or D.</p>
                </div>
            ),
            buttons: [],
        };
    }

    const session = activeTrivia[sessionid];
    const correct = answer === session.question.correctAnswer;

    // Clear the timeout and remove the session
    clearTimeout(session.timeout);
    delete activeTrivia[sessionid];

    if (correct) {
        // Fetch user data and update balance
        try {
            const response = await axios.post(
                `${CHATBOT_API_URL}/user/${walletAddress.toLowerCase()}/update`,
                { balance: getRandomInt(500, 1000) },
                {
                    headers: {
                        'x-api-key': CHATBOT_API_KEY,
                    },
                }
            );

            const newBalance = response.data.balance;

            return {
                accepts: [
                    {
                        id: "farcaster",
                        version: "vNext",
                    },
                    {
                        id: "xmtp",
                        version: "vNext",
                    },
                ],
                image: (
                    <div style={styles.container}>
                        <h1 style={styles.title}>🎉 Correct Answer!</h1>
                        <p style={styles.text}>You have won {response.data.balance} coins!</p>
                    </div>
                ),
                buttons: [],
            };
        } catch (error) {
            console.error('Error updating user balance:', error);
            return {
                accepts: [
                    {
                        id: "farcaster",
                        version: "vNext",
                    },
                    {
                        id: "xmtp",
                        version: "vNext",
                    },
                ],
                image: (
                    
                    <div style={styles.container}>
                        <h1 style={styles.title}>Error</h1>
                        <p style={styles.text}>There was an error awarding your coins. Please try again later.</p>
                    </div>
                ),
                buttons: [],
            };
        }
    } else {
        return {
            accepts: [
                {
                    id: "farcaster",
                    version: "vNext",
                },
                {
                    id: "xmtp",
                    version: "vNext",
                },
            ],
            image: (
                <div style={styles.container}>
                    <h1 style={styles.title}>❌ Incorrect Answer</h1>
                    <p style={styles.text}>Better luck next time!</p>
                </div>
            ),
            buttons: [],
        };
    }
});

// Helper function to generate random integer between min and max (inclusive)
function getRandomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Styling for the frame
const styles: { [key: string]: React.CSSProperties } = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        backgroundColor: '#222',
        color: '#fff',
        width: "100%",
        height: "100%",
        padding: '20px',
        borderRadius: '8px',
        maxWidth: '600px',
        margin: '0 auto',
        boxShadow: '0px 4px 15px rgba(0, 0, 0, 0.3)',
    },
    options: {
        display: 'flex',
        flexDirection: 'column',
        width: "100%",
        height: "100%",
        alignItems: 'center',
        marginBottom: '20px',
    },
    option: {
        fontSize: '1.2rem',
        color: '#4CAF50', // Green for answer options
        margin: '5px 0',
    },
    instruction: {
        fontSize: '1rem',
        color: '#aaa',
        marginTop: '20px',
    },
    title: {
        fontSize: '2.5rem',
        color: '#FFD700', // Gold color for title
        marginBottom: '20px',
        textAlign: 'center',
    },
    text: {
        fontSize: "1.2rem",
        marginBottom: "20px",
    },
    buttonA: {
        backgroundColor: "#4CAF50",
        color: "#fff",
        padding: "10px 20px",
        margin: "5px",
        borderRadius: "5px",
        cursor: "pointer",
        fontSize: "1rem",
        transition: "background-color 0.3s ease",
    },
    buttonB: {
        backgroundColor: "#2196F3",
        color: "#fff",
        padding: "10px 20px",
        margin: "5px",
        borderRadius: "5px",
        cursor: "pointer",
        fontSize: "1rem",
        transition: "background-color 0.3s ease",
    },
    buttonC: {
        backgroundColor: "#FF9800",
        color: "#fff",
        padding: "10px 20px",
        margin: "5px",
        borderRadius: "5px",
        cursor: "pointer",
        fontSize: "1rem",
        transition: "background-color 0.3s ease",
    },
    buttonD: {
        backgroundColor: "#f44336",
        color: "#fff",
        padding: "10px 20px",
        margin: "5px",
        borderRadius: "5px",
        cursor: "pointer",
        fontSize: "1rem",
        transition: "background-color 0.3s ease",
    },
};

function generateSessionId(length: number = 16): string {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let sessionId = '';
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        sessionId += characters[randomIndex];
    }
    return sessionId;
}

export const GET = handleRequest;
export const POST = postHandler;

