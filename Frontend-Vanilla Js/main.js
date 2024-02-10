const closeEventStreamBtn = document.getElementById("event-stream");

closeEventStreamBtn.addEventListener("click", () => {
  eventSource.close();
});

const eventSource = new EventSource("http://localhost:8000/");
let eventStatus;
eventSource.addEventListener(
  "NEW_LOG",
  (event) => {
    const data = JSON.parse(event.data);
    // use the data to update the UI
    eventStatus = data.status;
    console.log(eventStatus);
  },
  false
);

// const callAPI = async (content) => {
//   const response = await fetch("http://localhost:8000/", {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify({ content: content }),
//   });
//   const data = await response.json();
// };
