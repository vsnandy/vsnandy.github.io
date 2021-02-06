import React, { useState, useEffect, useRef } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import FormControl from 'react-bootstrap/FormControl';
import { FaRobot } from 'react-icons/fa';
import { AiOutlineClose, AiOutlineSend } from 'react-icons/ai';

import * as espn from '../../api/espn';
import { checkQuestion, getAPICall, formulateResponse, getHelp } from '../../db/ffl-bot-db';
import './ffl-bot.css';

const FFLBot = ({ state }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [messageCount, setMessageCount] = useState({
    vbot: 1,
    user: 0
  });
  const [conversation, setConversation] = useState([
    {
      id: 1,
      message: "Hi, I'm vBot! Type \"help\" to see what you can ask me.",
      sender: "vbot",
    },
  ]);
  const conversationRef = useRef(null);

  // Run after each re-render if conversation changes
  // Logic to scroll screen automatically
  useEffect(() => {
    if(conversationRef && conversationRef.current) {
      const element = conversationRef.current;
      element.scroll({
        top: element.scrollHeight,
        left: 0,
        behavior: "smooth"
      });
    }
  }, [isOpen, conversationRef, conversation]);

  // Renders the conversation onto the screen
  const Conversation = () => {
    return (
      <Container className="px-0" fluid>
        {conversation.map((c, idx) => {
          return (
            c.id === messageCount[c.sender]
            ? <p key={idx} className={`${c.sender} last`}>{c.message}</p>
            : <p key={idx} className={c.sender}>{c.message}</p>
          );
        })}
      </Container>
    );
  }

  // Function to handle message received
  const sendMessage = async (e) => {
    e.preventDefault();

    if(message && message.replace(/\s/g, '').length > 0) {
      setMessageCount(prevMesCount => ({...prevMesCount, user: prevMesCount.user + 1}));
      setConversation(prevConvo => {
        return (
          [...prevConvo, {
            id: messageCount.user + 1,
            message: message,
            sender: "user"
          }]
        );
      });
      await sendResponse(message);
    }
    setMessage(""); // clear the message
  }

  // vbot's response function
  const sendResponse = async (message) => {
    // check "help"
    if(message === "help") {
      const prompts = getHelp();
      prompts.forEach(h => {
        setMessageCount(prevMesCount => ({...prevMesCount, vbot: prevMesCount.vbot + 1}));
        setConversation(prevConvo => {
          return (
            [...prevConvo, {
              id: messageCount.vbot + 1,
              message: h,
              sender: "vbot"
            }]
          );
        });
      });
    }
    else {
      // check if it's a question
      if(message[message.length - 1] !== "?") {
        return;
      }

      // check the question bank
      const [match, params] = checkQuestion(message);

      // if no question matches, give generic sorry response
      if(!match) {
        setMessageCount(prevMesCount => ({...prevMesCount, vbot: prevMesCount.vbot + 1}));
        setConversation(prevConvo => {
          return (
            [...prevConvo, {
              id: messageCount.vbot + 1,
              message: "Hmm... not sure about that one. Maybe there's something else I can help you with?",
              sender: "vbot"
            }]
          );
        });
      } else {
        // destruct the user message based off matched question data
        const [apiKey, finalParams] = getAPICall(match, params, state);
        
        let response;
        // call the corresponding API with given params
        try {
          const data = await espn[apiKey](...finalParams);
          //console.log(data.result);
          response = formulateResponse(match, finalParams, state, data.result);
        } catch (err) {
          response = formulateResponse(match, finalParams, state, 0); 
        }
        //console.log(response);

        // if API call succeeds, respond with happy_path, else fail_path
        //
        setMessageCount(prevMesCount => ({...prevMesCount, vbot: prevMesCount.vbot + 1}));
        setConversation(prevConvo => {
          return (
            [...prevConvo, {
              id: messageCount.vbot + 1,
              message: response,
              sender: "vbot"
            }]
          );
        });
      }
    }
  }

  return (
    <div style={{ position: 'fixed', bottom: 0, right: 0, zIndex: 9999 }} className="d-flex mb-2 mr-1">
      {isOpen &&
        <Container 
          style={{ height: '350px', width: '300px' }} 
          className="d-flex flex-column px-0 bg-light border rounded shadow-lg" 
          fluid
        >
          <h3 className="bg-dark text-white rounded-top text-center pb-1 mb-0">
            <FaRobot size="1.2em"/>
          </h3>
          <Container ref={conversationRef} style={{ overflowY: 'auto' }} className="px-1 flex-grow-1 my-1" fluid>
            <Conversation />
          </Container>
          <Container className="px-1 mb-1" fluid>
            <Form onSubmit={sendMessage}>
              <InputGroup size="sm">
                <FormControl 
                  placeholder="Type a message..."
                  aria-label="Question"
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                />
                <InputGroup.Append>
                  <Button variant="dark" type="submit">
                    <AiOutlineSend size="1em" className="pb-1" />
                  </Button>
                </InputGroup.Append>
              </InputGroup>
            </Form>
          </Container>
        </Container>
      }
      <Button size="sm" onClick={() => setIsOpen(!isOpen)} className="ml-1 align-self-end bg-success">
        {isOpen 
          ? <AiOutlineClose size="1.2em" className="pb-1" />
          : <FaRobot size="1.2em" className="pb-1" />
        }
      </Button>
    </div>
  );
}

export default FFLBot;
