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

import './ffl-bot.css';

const FFLBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [messageCount, setMessageCount] = useState({
    vbot: 1,
    user: 0
  });
  const [conversation, setConversation] = useState([
    {
      id: 1,
      message: "Hi, I'm vBot! What would you like to know?",
      sender: "vbot",
    },
  ]);
  const conversationRef = useRef(null);

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

  const Conversation = () => {
    return (
      <Container className="px-0" fluid>
        {conversation.map((c, idx) => {
          //console.log(c.id, messageCount[c.sender]);
          return (
            c.id === messageCount[c.sender]
            ? <p key={idx} className={`${c.sender} last`}>{c.message}</p>
            : <p key={idx} className={c.sender}>{c.message}</p>
          );
        })}
      </Container>
    );
  }

  const sendMessage = async (e) => {
    e.preventDefault();

    if(message && message.replace(/\s/g, '').length > 0) {
      setMessageCount({...messageCount, user: messageCount.user + 1});
      setConversation([...conversation, {
        id: messageCount.user + 1,
        message: message,
        sender: "user"
      }]);
    }
    setMessage(""); // clear the message
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
            <FaRobot size="2rem"/>
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
                    <AiOutlineSend size="1rem" className="pb-1" />
                  </Button>
                </InputGroup.Append>
              </InputGroup>
            </Form>
          </Container>
        </Container>
      }
      <Button size="sm" onClick={() => setIsOpen(!isOpen)} className="ml-1 align-self-end">
        {isOpen 
          ? <AiOutlineClose size="1.2rem" className="pb-1" />
          : <FaRobot size="1.2rem" className="pb-1" />
        }
      </Button>
    </div>
  );
}

export default FFLBot;