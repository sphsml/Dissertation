import { Sidebar, Menu, MenuItem, SubMenu } from "react-pro-sidebar";
import "./components.css";
import { React, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Divider } from "@react-md/divider";
import Layout from "./Layout"
import { Chart } from "react-google-charts";

const messages = [
  "The new tax year starts soon.",
  "Interest rates have been updated.",
  "You have unread insights from your advisor.",
];

const headlines = [
  {
    title: "Should stocks and shares ISAs be exempt from inheritance tax?",
    url: "https://www.thetimes.co.uk/article/stocks-and-shares-isas-uk-inheritance-tax-f8mc39pzh?utm_source=chatgpt.com",
  },
  {
    title:
      "I saved £2,600 for my two children using the 'penny-a-day' challenge",
    url: "https://www.thescottishsun.co.uk/money/14340217/how-save-money-children-penny-day-challenge/?utm_source=chatgpt.com",
  },
  {
    title:
      "Popular bank with 2 million customers to make big change to accounts TOMORROW",
    url: "https://www.thesun.co.uk/money/33333498/popular-bank-to-make-big-change-to-accounts/?utm_source=chatgpt.com",
  },
  {
    title: "Banks slash savings rates after Bank of England rate cut",
    url: "https://www.ft.com/content/105dae43-02b1-4ff2-8787-857c53f9d343?utm_source=chatgpt.com",
  },
  {
    title:
      "Big bank with 3.6 million customers axes popular feature TODAY and customers could miss out on cash",
    url: "https://www.thescottishsun.co.uk/money/14309950/bank-change-interest-payments/?utm_source=chatgpt.com",
  },
];

const accessibility = [
  {
    title:
      "'I was considered the most junior person in the room': Senior disabled finance workers on promotion battles and prejudiced attitudes",
    link: "https://www.fnlondon.com/articles/i-face-prejudice-everyday-senior-disabled-finance-workers-from-hsbc-pwc-janus-henderson-and-rbs-international-fight-for-inclusion-9de12887?utm_source=chatgpt.com",
  },
  {
    title: "Mobility Mojo taps investor to boost accessibility in buildings",
    link: "https://www.thetimes.co.uk/article/mobility-mojo-taps-investor-to-boost-accessibility-in-buildings-2wd2n7msf?utm_source=chatgpt.com",
  },
  {
    title:
      "How a cousin's disability inspired an inclusive housing organisation",
    link: "https://www.ft.com/content/f5676f27-6f98-4151-90d4-8325661100f9?utm_source=chatgpt.com",
  },
  {
    title: "Governments urged to fund disability reform",
    link: "https://www.theaustralian.com.au/nation/politics/governments-urged-to-fund-disability-reform/news-story/617da27f1d28224b9aed67812c8946a1?utm_source=chatgpt.com",
  },
  {
    title: "Little progress in France on inclusion of people with disabilities",
    link: "https://www.lemonde.fr/en/france/article/2024/09/05/little-progress-in-france-on-inclusion-of-people-with-disabilities_6724847_7.html?utm_source=chatgpt.com",
  },
];

export default function Home() {
  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const navigate = useNavigate();

  const data = [
    ["Month", "Everyday Saver", "ISA"],
    ["Jan 24", 1.8, 2.8],
    ["Feb 24", 1.9, 2.82],
    ["Mar 24", 1.85, 2.82],
    ["Apr 24", 1.8, 2.86],
    ["May 24", 1.7, 2.85],
    ["Jun 24", 1.78, 2.87],
    ["Jul 24", 1.82, 2.88],
    ["Aug 24", 1.88, 2.9],
    ["Sep 24", 1.86, 2.88],
    ["Oct 24", 1.85, 2.9],
    ["Nov 24", 1.85, 2.88],
    ["Dec 24", 1.88, 2.86],
  ];

  const sections = [
    "Welcome back, Oliver. Here are the latest statistics on your investments. For further information, press the down arrow into the sections.",
    "Balance details.",
    "Investment performance data.",
    "Latest Investment Headlines.",
    "Recent headlines on disability inclusion in finance.",
    "Settings",
  ];

  const subsections = [
    ["Your total balance is £9,328.55, with £360 from investments"],
    [
      data
        .slice(1)
        .map(
          (row) =>
            `Month: ${row[0]}, Everyday Saver: ${row[1]}%, ISA: ${row[2]}%`
        ),
    ],
    headlines.map((headline) => headline.title),
    accessibility.map((item) => item.title),
    ["Messages", "Savings", "Insights", "Payments"],
  ];
  const [showModal, setShowModal] = useState(false);
  const [, setCurrentSectionIndex] = useState(0);
  const speakText = (text) => {
    if (!text) return;
    const synth = window.speechSynthesis;
    const utterance = new SpeechSynthesisUtterance(text);
    synth.cancel(); // Stop any previous speech
    synth.speak(utterance);
  };

  const handleKeyDown = (event) => {
    if (event.key === "ArrowRight") {
      setCurrentSectionIndex((prevIndex) => {
        const newIndex = Math.min(prevIndex + 1, sections.length - 1);
        speakText(sections[newIndex]);
        return newIndex;
      });
    } else if (event.key === "ArrowLeft") {
      setCurrentSectionIndex((prevIndex) => {
        const newIndex = Math.max(prevIndex - 1, 0);
        speakText(sections[newIndex]);
        return newIndex;
      });
    } else if (event.key === "ArrowDown") {
      setCurrentSectionIndex((prevIndex) => {
        console.log(prevIndex);
        if (prevIndex > 0) {
          speakText(subsections[prevIndex - 1]);
        }
        return prevIndex;
      });
    }
  };

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
  };

  const options = {
    chart: {
      title: "Investments Performance",
    },
  };
  return (
    <div style={{ display: "flex" }}>
      <div className="sidebar-container">
        <Sidebar>
          <Menu>
            <>
              <h1>@One4All</h1>
              <br />
              <SubMenu label="Overview">
                <MenuItem onClick={() => navigate("/home")}> Summary </MenuItem>
                <MenuItem> Custom View </MenuItem>
              </SubMenu>
              <br />
              <Divider />
              <br />
              <MenuItem onClick={() => setShowModal(true)}>
                Messages{" "}
                <span
                  style={{
                    backgroundColor: "#dc2626",
                    color: "white",
                    borderRadius: "9999px",
                    padding: "2px 8px",
                    fontSize: "0.75rem",
                    marginLeft: "8px",
                    fontWeight: "bold",
                  }}
                >
                  {messages.length}
                </span>
              </MenuItem>
              <MenuItem onClick={() => navigate("/savings")}>
                {" "}
                Savings{" "}
              </MenuItem>
              <MenuItem> Insights </MenuItem>
              <MenuItem onClick={() => navigate("/payments")}> Payments </MenuItem>
              <br />
              <Divider />
              <MenuItem> Settings </MenuItem>
              <div className="menu-spacer">
                <Divider />
                <MenuItem> Help </MenuItem>
                <MenuItem> Contact Us </MenuItem>
                <br />
                <MenuItem> Log Out </MenuItem>
              </div>
            </>
          </Menu>
        </Sidebar>
      </div>
      <div style={{ display: "flex" }}>
        <div className="main-home" style={{ flex: 2 }}>
          <div className="bordered-div">
            <h1>Welcome back, Oliver</h1>
            <p>Here are the latest statistics on your investments</p>
          </div>

          <div className="bordered-div" style={{ flex: 3, minWidth: "600px" }}>
            <h1>Total balance</h1>
            <h3>£9,328.55</h3>
            <p>£360 from investments</p>
          </div>

          <div className="bordered-div" style={{ flex: 3, minWidth: "80%" }}>
            <Chart
              chartType="Line"
              width="100%"
              height="400px"
              data={data}
              options={options}
            />
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            className="bordered-div"
            style={{ marginLeft: "20px", maxWidth: "70%" }}
          >
            <h2 className="text-xl font-bold mb-4">
              Latest Investment Headlines
            </h2>
            <ul className="list-disc pl-5">
              {headlines.map((headline, index) => (
                <li key={index} className="mb-2">
                  <a
                    href={headline.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    {headline.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div
            className="bordered-div"
            style={{ marginLeft: "20px", maxWidth: "70%" }}
          >
            <h1>Recent Headlines on Disability Inclusion in Finance</h1>
            <ul>
              {accessibility.map((headline, index) => (
                <li key={index}>
                  <a
                    href={headline.link}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {headline.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      {showModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              backgroundColor: "#fff",
              padding: "24px",
              borderRadius: "12px",
              minWidth: "320px",
              maxWidth: "500px",
              boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
            }}
          >
            <h2 style={{ marginBottom: "16px" }}>Messages</h2>
            <ul style={{ listStyle: "disc", paddingLeft: "20px" }}>
              {messages.map((msg, idx) => (
                <li key={idx} style={{ marginBottom: "10px" }}>
                  {msg}
                </li>
              ))}
            </ul>
            <button
              onClick={() => setShowModal(false)}
              style={{
                marginTop: "20px",
                backgroundColor: "#3b82f6",
                color: "#fff",
                border: "none",
                padding: "8px 16px",
                borderRadius: "6px",
                cursor: "pointer",
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
