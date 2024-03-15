class EventModel {
  constructor() {
    this.events = [];
    this.onChange = null;
    this.baseURL = "http://localhost:3000/events";
    this.readEvents();
  }

  async addEvent(eventData) {
    // POST request to server to add event
    // On success, push event to this.events and call this.onChange()
    try {
      const response = await fetch(this.baseURL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(eventData),
      });
      if (!response.ok) {
        throw new Error("Event creation failed");
      }
      const newEvent = await response.json();
      this.events.push(newEvent);
      this.onChange(this.events);
    } catch (error) {
      console.error("Error adding new event:", error);
    }
  }

  async deleteEvent(eventId) {
    // DELETE request to server to delete event
    // On success, filter event from this.events and call this.onChange()
    try {
      const response = await fetch(`${this.baseURL}/${eventId}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Event deletion failed");
      }
      this.events = this.events.filter((event) => event.id !== eventId);
      this.onChange(this.events);
    } catch (error) {
      console.error("Error deleting event:", error);
    }
  }

  async editEvent(eventId, newEventData) {
    try {
      const response = await fetch(`${this.baseURL}/${eventId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newEventData),
      });
      if (!response.ok) {
        throw new Error("Event update failed");
      }
      const updatedEvent = await response.json();
      const eventIndex = this.events.findIndex((event) => event.id === eventId);
      if (eventIndex >= 0) {
        this.events[eventIndex] = updatedEvent;
        this.onChange(this.events);
      }
    } catch (error) {
      console.error("Error updating event:", error);
    }
  }

  async readEvents() {
    // GET request to server to get all events
    // On success, set this.events and call this.onChange()
    const response = await fetch(this.baseURL);
    const events = await response.json();
    this.events = events;
    this.onChange(this.events);
  }
}

class EventView {
  constructor() {
    // Reference form elements, list container, etc.
    this.addEventButton = document.getElementById("add-event-btn");
    this.addEventButton.addEventListener("click", (e) => {
      e.preventDefault();
      this.addNewEventRow();
    });
  }
  addNewEventRow() {
    const eventListTBody = document.querySelector("#event-list tbody");
    const newEventRow = document.createElement("tr");
    newEventRow.innerHTML = `
    <td><input type="text" class="event__name-input" placeholder="Event Name"/></td>
    <td><input type="date" class="event__start-input"/></td>
    <td><input type="date" class="event__end-input"/></td>
    <td>
      <div class="event__actions">
        <button class="event__save-new-btn">
        <svg focusable viewBox="0 0 24 24" aria-hidden="true xmlns="http://www.w3.org/2000/svg"><path d="M12 6V18M18 12H6" stroke="#FFFFFF" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </button>
        <button class="event__cancel-new-btn">
          <svg class="icon" focusable="false" aria-hidden="true" viewBox="0 0 32 32" version="1.1" xmlns="http://www.w3.org/2000/svg">
            <path fill="#FFFFFF" d="M19.587 16.001l6.096 6.096c0.396 0.396 0.396 1.039 0 1.435l-2.151 2.151c-0.396 0.396-1.038 0.396-1.435 0l-6.097-6.096-6.097 6.096c-0.396 0.396-1.038 0.396-1.434 0l-2.152-2.151c-0.396-0.396-0.396-1.038 0-1.435l6.097-6.096-6.097-6.097c-0.396-0.396-0.396-1.039 0-1.435l2.153-2.151c0.396-0.396 1.038-0.396 1.434 0l6.096 6.097 6.097-6.097c0.396-0.396 1.038-0.396 1.435 0l2.151 2.152c0.396 0.396 0.396 1.038 0 1.435l-6.096 6.096z"/>
          </svg>
        </button>
      </div>
    </td>
    `;
    eventListTBody.append(newEventRow); // Adds the new row at the top of the tbody

    // Attach event listeners to the save and cancel buttons
    newEventRow
      .querySelector(".event__save-new-btn")
      .addEventListener("click", () => {
        this.onSaveNewEvent(newEventRow);
      });

    newEventRow
      .querySelector(".event__cancel-new-btn")
      .addEventListener("click", () => {
        newEventRow.remove();
      });
  }

  onSaveNewEvent(newEventRow) {
    const eventName = newEventRow
      .querySelector(".event__name-input")
      .value.trim();
    const eventStart = newEventRow.querySelector(".event__start-input").value;
    const eventEnd = newEventRow.querySelector(".event__end-input").value;

    // Validation or further action to save the new event
    // this.onAddEvent can be a method passed down from the EventController
    this.onAddEvent({
      eventName: eventName,
      startDate: eventStart,
      endDate: eventEnd,
    });
  }

  onAddEvent(callback) {
    this.onAddEvent = callback;
  }

  render(events) {
    const eventListTBody = document.querySelector("#event-list tbody");
    eventListTBody.innerHTML = ""; // Clear the current list

    events.forEach((event) => {
      const eventRow = document.createElement("tr");
      eventRow.innerHTML = `
        <td>
          <span class="event__name">${event.eventName}</span>
          <input type="text" class="event__name-input" value="${event.eventName}" style="display: none;"/>
        </td>
        <td>
          <span class="event__start">${event.startDate}</span>
          <input type="date" class="event__start-input" value="${event.startDate}" style="display: none;"/>
        </td>
        <td>
          <span class="event__end">${event.endDate}</span>
          <input type="date" class="event__end-input" value="${event.endDate}" style="display: none;"/>
        </td>
        <td>
          <div class="event__actions">
            <button class="event__edit-btn">Edit</button>
            <button class="event__save-btn" style="display: none;">Save</button>
            <button class="event__del-btn">Delete</button>
            <button class="event__cancel-btn" style="display: none;">Cancel</button>
          </div>
        </td>
      `;
      eventRow.querySelector(
        ".event__edit-btn"
      ).innerHTML = `<svg focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="EditIcon" aria-label="fontSize small"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34a.9959.9959 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"></path></svg>`;
      eventRow.querySelector(
        ".event__del-btn"
      ).innerHTML = `<svg focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="DeleteIcon" aria-label="fontSize small"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"></path></svg>`;
      eventRow.querySelector(
        ".event__save-btn"
      ).innerHTML = `<svg focusable="false" aria-hidden="true" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M21,20V8.414a1,1,0,0,0-.293-.707L16.293,3.293A1,1,0,0,0,15.586,3H4A1,1,0,0,0,3,4V20a1,1,0,0,0,1,1H20A1,1,0,0,0,21,20ZM9,8h4a1,1,0,0,1,0,2H9A1,1,0,0,1,9,8Zm7,11H8V15a1,1,0,0,1,1-1h6a1,1,0,0,1,1,1Z"/></svg>`;
      eventRow.querySelector(
        ".event__cancel-btn"
      ).innerHTML = `<svg focusable="false" aria-hidden="true" viewBox="0 0 32 32" version="1.1" xmlns="http://www.w3.org/2000/svg"><path d="M19.587 16.001l6.096 6.096c0.396 0.396 0.396 1.039 0 1.435l-2.151 2.151c-0.396 0.396-1.038 0.396-1.435 0l-6.097-6.096-6.097 6.096c-0.396 0.396-1.038 0.396-1.434 0l-2.152-2.151c-0.396-0.396-0.396-1.038 0-1.435l6.097-6.096-6.097-6.097c-0.396-0.396-0.396-1.039 0-1.435l2.153-2.151c0.396-0.396 1.038-0.396 1.434 0l6.096 6.097 6.097-6.097c0.396-0.396 1.038-0.396 1.435 0l2.151 2.152c0.396 0.396 0.396 1.038 0 1.435l-6.096 6.096z"></path></svg>`;

      eventListTBody.appendChild(eventRow);

      // Attach event listeners to the buttons in eventRow
      eventRow
        .querySelector(".event__edit-btn")
        .addEventListener("click", () => {
          this.toggleEdit(eventRow, true);
        });

      eventRow
        .querySelector(".event__save-btn")
        .addEventListener("click", () => {
          this.onSaveEvent(event.id, eventRow);
        });

      eventRow
        .querySelector(".event__cancel-btn")
        .addEventListener("click", () => {
          this.toggleEdit(eventRow, false);
        });

      eventRow
        .querySelector(".event__del-btn")
        .addEventListener("click", () => {
          this.onDeleteEvent(event.id);
        });
    });
  }

  toggleEdit(eventRow, isEditing) {
    const spans = eventRow.querySelectorAll("span");
    const inputs = eventRow.querySelectorAll("input");
    const editBtn = eventRow.querySelector(".event__edit-btn");
    const saveBtn = eventRow.querySelector(".event__save-btn");
    const cancelBtn = eventRow.querySelector(".event__cancel-btn");
    const deleteBtn = eventRow.querySelector(".event__del-btn");

    spans.forEach((span) => (span.style.display = isEditing ? "none" : ""));
    inputs.forEach((input) => (input.style.display = isEditing ? "" : "none"));
    editBtn.style.display = isEditing ? "none" : "";
    saveBtn.style.display = isEditing ? "" : "none";
    cancelBtn.style.display = isEditing ? "" : "none";
    deleteBtn.style.display = isEditing ? "none" : "";
  }

  onSaveEvent(eventId, eventDiv) {
    // Logic to save edited event
    // Collect the data from input fields and call this.onSaveEdit
    const updatedEventName = eventDiv
      .querySelector(".event__name-input")
      .value.trim();
    const updatedStartDate = eventDiv
      .querySelector(".event__start-input")
      .value.trim();
    const updatedEndDate = eventDiv
      .querySelector(".event__end-input")
      .value.trim();

    this.onSaveEdit(eventId, {
      eventName: updatedEventName,
      startDate: updatedStartDate,
      endDate: updatedEndDate,
    });
  }

  onDeleteEvent(callback) {
    this.onDeleteEvent = callback;
  }

  onSaveEdit(callback) {
    this.onSaveEdit = callback;
  }

  onCancelEdit(callback) {
    this.onCancelEdit = callback;
  }

  // Methods to get event data from form, clear form, show/hide forms, etc.
}

class EventController {
  constructor(model, view) {
    this.model = model;
    this.view = view;

    // Set up callback for view's add event action
    this.view.onAddEvent = (eventData) => this.model.addEvent(eventData);

    // Set up callback for view's delete event action
    this.view.onDeleteEvent = (eventId) => this.model.deleteEvent(eventId);

    this.view.onSaveEdit = (eventId, updatedEventData) => {
      this.model.editEvent(eventId, updatedEventData);
    };

    this.view.onCancelEdit = (eventId) => {
      // Typically this would reset the event view to its non-editing state
      // But I want to keep the edit data, so no action is needed
    };

    // Register model listeners
    this.model.onChange = (events) => this.view.render(events);

    // Initial render
    this.view.render(this.model.events);
  }

  // Handlers for adding, editing, and deleting events
}

const app = new EventController(new EventModel(), new EventView());
