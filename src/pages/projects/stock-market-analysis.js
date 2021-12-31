import React, { useState, useEffect, useRef } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import InputGroup from 'react-bootstrap/InputGroup';
import ListGroup from 'react-bootstrap/ListGroup';
import FormControl from 'react-bootstrap/FormControl';
import Spinner from 'react-bootstrap/Spinner';
import Card from 'react-bootstrap/Card';
import * as d3 from 'd3';

import Layout from '../../components/layout';
import SEO from '../../components/seo';
import '../../styles/stock-market-analysis.css';
import { getQuotes, getHistoricalPricing, numberWithCommas } from '../../api/tradier';
import * as Calendar from '../../db/calendar';
import { style } from 'd3';
import NotFound from '../404';

const Circles = () => {
  const [data, setData] = useState([25, 30, 45, 60, 20]);

  // Creates a reference to a DOM element
  const svgRef = useRef();
  
  // triggered every render (or when dependency array changes)
  useEffect(() => {
    console.log(svgRef);
    // sets the created reference's current location
    // to a d3 const/object
    const svg = d3.select(svgRef.current);

    // can log this and see there is an _enter, _exit, and _update
    // attribute, which we will have to use the join() api to handle
    svg
      .selectAll("circle")
      .data(data)
      .join("circle")
      .attr("r", value => value)
      .attr("cx", value => value * 2)
      .attr("cy", value => value * 2)
      .attr("stroke", "red");
  }, [data]);

  // set the svg source reference to created svgRef from above
  return (
    <Container fluid>
      <svg ref={svgRef}></svg>
      <br />
      <button onClick={() => setData(data.map(value => value + 5))}>
        Update data
      </button>
      <button onClick={() => setData(data.filter(value => value <= 35))}>
        Filter data
      </button>
    </Container>
  );
}

const StockChart = () => {
  const [prices, setPrices] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [period, setPeriod] = useState(null);
  const [loading, setLoading] = useState(false);
  const svgRef = useRef();

  // stock quotes
  const [search, setSearch] = useState('');
  const [quote, setQuote] = useState(null);

  const [tooltipDate, setTooltipDate] = useState("");

  useEffect(() => {
    if(prices) {
      //console.log(startDate, endDate);
      const filtPrices = prices.filter(value => {
        if(!value.close) console.log(value.date);
        const [yyyy, mm, dd] = value.date.split("-");
        const dt = new Date(yyyy, Number(mm)-1, dd);
        return dt >= startDate && dt <= endDate
      });

      const filtDates = filtPrices.map(d => {
        const [yyyy, mm, dd] = d.date.split("-")
        return new Date(yyyy, +mm - 1, dd);
      });

      //console.log(filtPrices);
      const svg = d3.select(svgRef.current);
      const width = 800;
      const height = 400;
      const margin = { top: 20, right: 30, bottom: 30, left: 40 };

      // Make svg box responsive
      svg
        .attr("viewBox", `0 0 ${width} ${height}`)
        .attr("preserveAspectRatio", "xMinYMin meet")

      //console.log(d3.extent(filtPrices, d => (new Date(d.date)).setHours(0, 0, 0, 0)));
      const xScale = d3.scaleTime()
        //.domain([d3.min(aapl, d => d.date), d3.max(aapl, d => d.date)])
        //.domain(d3.extent(aapl, d => d.date))
        //.domain(d3.extent(filtPrices, d => {
        //  let [yyyy, mm, dd] = d.date.split("-");
        //  return new Date(yyyy, +mm - 1, dd);
        //}))
        // Don't use extent, as it is a range
        // Use map instead to get only values in the prices array
        .domain(filtDates)
        //.range([0, svg.node().getBoundingClientRect().width]);
        .range(d3.range(0, width, width / filtPrices.length))
        .nice()
      
      const yScale = d3.scaleLinear()
        .domain([d3.min(filtPrices, d => +d.close), d3.max(filtPrices, (d) => +d.close)])
        //.range([svg.node().getBoundingClientRect().height, 0]); // start from bottom to top
        .range([height, 0])
        .nice()
      
      const xAxis = d3.axisBottom(xScale)
        //.ticks(aapl.length)
        .tickFormat(d3.timeFormat("%d"));
      svg
        .select(".x-axis")
        .style("transform", 
          //`translateY(${svg.node().getBoundingClientRect().height}px)`)
          `translateY(${height}px)`)
        .call(xAxis)
        .attr("font-family", 'DM Sans');

      const yAxis = d3.axisLeft(yScale);
      svg
        .select(".y-axis")
        .style("transform", "translateX(0px)")
        .call(yAxis)
        .attr("font-family", "DM Sans");

      const myLine = d3.line()
        .x(value => {
          const [yyyy, mm, dd] = value.date.split("-");
          return xScale(new Date(yyyy, +mm - 1, dd));
        })
        .y(value => yScale(value.close.toFixed(2)))
        //.curve(d3.curveCardinal)

      const tooltipLine = d3.line()
        .x(value => {
          //console.log(value);
          const [yyyy, mm, dd] = value.date.split("-");
          return xScale(new Date(yyyy, +mm - 1, dd));
        })
        .y(value => +value.y)

      svg
        .selectAll(".line")
        .data([filtPrices])
        .join("path")
        .attr("class", "line")
        .attr("d", myLine)
        .attr("fill", "none")
        .attr("stroke", "rgba(0, 200, 5, 1)")
        .attr("stroke-width", "3px")

      const tooltipInputs = [{ date: tooltipDate, y: 0 }, { date: tooltipDate, y: height }];

      // Tooltip line
      tooltipDate && 
      svg
        .selectAll(".tooltip-line")
        .data([tooltipInputs])
        .join("path")
        .attr("class", "tooltip-line")
        .attr("d", tooltipLine)
        .attr("opacity", value => {
          const day = filtPrices.find(d => d.date === value[0].date);
          if(day) return "1";
          return "0";
        })

      // Tooltip circle
      tooltipDate &&
      svg
        .selectAll(".tooltip-circle")
        .data([tooltipInputs])
        .join("circle")
        .attr("class", "tooltip-circle")
        .attr("r", value => {
          const day = filtPrices.find(d => d.date === value[0].date);
          if(day) {
            return 7;
          }

          return 0;
        })
        .attr("cx", value => {
          const [yyyy, mm, dd] = value[0].date.split("-");
          return xScale(new Date(yyyy, +mm - 1, dd));
        })
        .attr("cy", value => {
          const yVal = filtPrices.find(d => {
            return d.date === value[0].date
          });
          if(yVal) {
            return yScale(+yVal.close)
          }
        })

      tooltipDate &&
        svg
          .selectAll(".tooltip-card")
          .data([tooltipInputs])
          .join("text")
          .attr("class", "tooltip-card")
          .style("transform", "translateY(-0.4em)")
          .attr("x", value => {
            const [yyyy, mm, dd] = value[0].date.split("-");
            return xScale(new Date(yyyy, +mm - 1, dd));
          })
          .text(value => {
            const data = filtPrices.find(d => d.date === value[0].date);
            if(data) {
              return data.date;
              //return "$" + numberWithCommas(data.close.toFixed(2));
            }
            return null;
          })

      // Listening Rectangle
      svg
        .selectAll(".listening-rect")
        .data([filtPrices])
        .join("rect")
        .attr("class", "listening-rect")
        .attr("width", width)
        .attr("height", height)
        .attr("pointer-events", "all")
        .on("mousemove", (event) => {
          const x = d3.pointer(event)[0]; // grab mouse x position within svg
          const dt = xScale.invert(x); // inversion of scale to get date
          
          // dt is DateTime conversion, set tooltip date to ceiling if > noon, else floor
          //console.log(dt.getHours());

          // LOGIC
          // If dt.getHours() < 12, need previous price/date
          // this means you filter filtPrices.filter(d => d.date <= dt.getFullDate + 1)
          let cutoffDate = new Date();
          
          if(dt.getHours() < 12) {
            cutoffDate = new Date(dt.getFullYear(), dt.getMonth(), dt.getDate());
          } else {
            const nextDay = Calendar.getNextDay(dt.getDate(), dt.getMonth(), dt.getFullYear());
            cutoffDate = new Date(nextDay.year, nextDay.month, nextDay.day);
          }

          console.log(Calendar.getDateISO(cutoffDate));

          // ISSUE
          // Holidays/Weekends still getting mapped in xScale - how do we snap the tooltip
          // up/down depending on each scenario
          const dtString = Calendar.getDateISO(cutoffDate);
          setTooltipDate(dtString);
        })
    }
  }, [tooltipDate, prices, startDate, endDate]);

  const QuoteCard = () => {
    return(
      quote ?
        quote.quote
          ?
            <Card bg="light" text="dark" style={{ width: "100%" }} className="mx-3">
              <Card.Header className="px-3">
                <Card.Title className="my-0">
                  {quote.quote.description} ({quote.quote.symbol})<br />{prices[prices.length - 1].date}
                </Card.Title>
              </Card.Header>
              <Card.Body className="px-3">
                <Row>
                  {[["Last", quote.quote.last],
                    ["Prev", quote.quote.prevclose],
                    ["High", quote.quote.high],
                    ["Low", quote.quote.low]
                  ].map((val, idx) => {
                    return (
                      <Col xs="6" key={idx} className="mb-2">
                        <div><b>{val[0]}</b></div>
                        <div>${numberWithCommas(val[1].toFixed(2))}</div>
                      </Col>
                    )
                  })}
                </Row>
              </Card.Body>
            </Card>
          : <div className="mx-3"><i style={{ color: 'red' }}>Invalid Ticker...</i></div>
        : <div className="mx-3" />
    );
  }

  // ButtonGroup for choosing historical time period
  const TimeButtons = () => {
    const onSelect = (val) => {
      setPeriod(val);
      const today = new Date();
      const multiplier = +(val[0]);
      let newStartDate = new Date();

      // Conditionally Assign
      if(val[1] === "D") {
        if(today.getDate() === 1) {
          const prevMonth = Calendar.getPreviousMonth(today.getMonth() + 1, today.getFullYear());
          const prevMonthDays = Calendar.getMonthDays(prevMonth.month);
          newStartDate.setDate(prevMonthDays);
          newStartDate.setFullYear(prevMonth.year);
          newStartDate.setMonth(prevMonth.month - 1);
        } else {
          newStartDate.setDate(newStartDate.getDate() - 1);
        }
      } else if(val[1] === "W") {
        if(today.getDate() < 7) {
          const prevMonth = Calendar.getPreviousMonth(today.getMonth() + 1, today.getFullYear());
          const prevMonthDays = Calendar.getMonthDays(prevMonth.month);
          newStartDate.setDate((today.getDate() - 7) + prevMonthDays);
          newStartDate.setMonth(prevMonth.month - 1);
          newStartDate.setFullYear(prevMonth.year);
        } else {
          newStartDate.setDate(newStartDate.getDate() - 7);
        }
      } else if(val[1] === "M") {
        let newMonth = today.getMonth() + 1;
        let newYear = today.getFullYear();

        // Loop previous month
        for(let i = 0; i < multiplier; i++) {
          const prev = Calendar.getPreviousMonth(newMonth, newYear);
          newMonth = prev.month;
          newYear = prev.year;
        }

        newStartDate.setMonth(newMonth - 1);
        newStartDate.setFullYear(newYear);
      } else { // "Y"
        newStartDate.setFullYear(today.getFullYear() - multiplier);
      }
      newStartDate.setHours(0, 0, 0, 0);
      console.log(Calendar.getDateISO(newStartDate));
      setStartDate(newStartDate);
    }

    return (
      <ListGroup variant="flush">
        {["1D", "1W", "1M", "3M", "1Y", "5Y"].map((val, idx) => {
          return (
            <ListGroup.Item
              key={idx} 
              className={val === period ? "px-1 py-2 text-center time-button-active" : "px-1 py-2 text-center time-button"}
              as="button"
              onClick={() => onSelect(val)}
            >
              {val}
            </ListGroup.Item>
          );
        })}
      </ListGroup>
    );
  }

  // on ticker submit
  const onSubmit = async () => {
    setLoading(true);
    // Get quote
    const q = await getQuotes(search);
    //console.log(q);
    let input = document.getElementsByName("ticker")[0];
    input.value = '';
    setQuote(q.quotes);

    // Get 5-year historical pricing
    console.log(search);
    const p = await getHistoricalPricing(search);
    //console.log(p);
    if(p && q.quotes.quote) {
      const arr = p.history.day;
      setPrices(arr);

      const [syyyy, smm, sdd] = arr[0].date.split("-");
      const [eyyyy, emm, edd] = arr[arr.length - 1].date.split("-");
      setStartDate(new Date(syyyy, Number(smm)-1, sdd));
      setEndDate(new Date(eyyyy, Number(emm)-1, edd));
      setPeriod("5Y");
    } else {
      setPrices(null);
      setStartDate(null);
      setEndDate(null);
      setPeriod(null);
    }
    setSearch('');
    setLoading(false);
  }

  const displayPrice = () => {
    const day = prices.find(d => d.date === tooltipDate);

    if(day) {
      return numberWithCommas(day.close.toFixed(2));
    }

    return numberWithCommas(quote.quote.last.toFixed(2));
  }

  return (
    <Container fluid>
      <Row>
        {
          <Col xs="7" className="ml-5 mt-3 mb-2 mr-3 px-4 py-2 border rounded">
            <Row>
              {quote && quote.quote
                ? (
                    <div className="text-left mr-3">
                      <h3>{quote.quote.description} ({quote.quote.symbol})</h3>
                      <h2>${prices && displayPrice()}</h2>
                    </div>
                  )
                : <h3 className="text-center mr-3">Enter a Ticker</h3>
              }
            </Row>
            <Row className="mt-4 mb-4 d-flex-row justify-content-between align-items-center">
              <svg ref={svgRef} className="svg-container ml-4" style={{ width: "80%" }}>
                {/*<g className="tooltip-line" />*/}
                {<g className="x-axis" />}
                {<g className="y-axis" />}
              </svg>
              {quote && quote.quote && 
                <div className="pl-3 mr-2">
                  <TimeButtons />
                </div>}
            </Row>
          </Col>
        }
        <Col xs="4" className="mt-3 mb-2">
          <InputGroup className="mb-2 ml-0 px-0 w-100">
            <FormControl
              placeholder="Ticker (e.g., AAPL, TSLA)"
              id="ticker"
              name="ticker"
              aria-label="ticker"
              aria-describedby="basic-addon1"
              onChange={(event) => setSearch(event.target.value)}
            />
            <Button variant="outline-dark" id="submit-ticker" type="submit" onClick={onSubmit}>
              Submit
            </Button>
          </InputGroup>
          <Row>
            {loading
              ? <Container fluid><Spinner animation="grow" variant="dark" /></Container>
              : <QuoteCard />}
          </Row>
        </Col>
      </Row>
    </Container>
  );
}

const LineChart = () => {
  const [data, setData] = useState([25, 30, 45, 60, 20, 65, 75]);
  const svgRef = useRef();

  useEffect(() => {
    const svg = d3.select(svgRef.current);
    const xScale = d3.scaleLinear()
      .domain([0, data.length - 1])
      .range([0, svg.node().getBoundingClientRect().width]);
    
    const yScale = d3.scaleLinear()
      .domain([0, d3.max(data) * 2])
      .range([svg.node().getBoundingClientRect().height, 0]); // start from bottom to top
    
    const xAxis = d3.axisBottom(xScale)
      .ticks(data.length)
      .tickFormat(index => index + 1);
    svg
      .select(".x-axis")
      .style("transform", 
        `translateY(${svg.node().getBoundingClientRect().height}px)`)
      .call(xAxis);

    const yAxis = d3.axisLeft(yScale);
    svg
      .select(".y-axis")
      .call(yAxis);

    const myLine = d3.line()
      .x((value, index) => xScale(index))
      .y(yScale);
      //.curve(d3.curveCardinal);

    svg
      .selectAll(".line")
      .data([data])
      .join("path")
      .attr("class", "line")
      .attr("d", myLine)
      .attr("fill", "none")
      .attr("stroke", "blue");
  }, [data]);

  return (
    <Container fluid>
      <svg ref={svgRef} height="300px" width="750px" style={{backgroundColor: "beige", overflow: "visible", margin: "50px"}}>
        <g className="x-axis" />
        <g className="y-axis" />
      </svg>
    </Container>
  );
}

const AppSoon = () => {
  return (
    <Layout>
      <SEO title="Stocks" />
      <h1 className="text-center my-3">Stock Market Analysis</h1>
      <StockChart />
    </Layout>
  );
}

const App = () => (
  <NotFound />
)

export default App;