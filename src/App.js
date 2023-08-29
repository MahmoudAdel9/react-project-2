import { useState } from "react";
const imgs = [
  "https://i.pravatar.cc/48?u=23",
  "https://i.pravatar.cc/48?u=19",
  "https://i.pravatar.cc/48?u=287",
  "https://i.pravatar.cc/48?u=aaaa",
];
const initialFriends = [
  {
    id: 115,
    name: "Mohab",
    image: "https://i.pravatar.cc/48?u=115",
    balance: -7,
  },
  {
    id: 15,
    name: "Salah",
    image: "https://i.pravatar.cc/48?u=15",
    balance: 20,
  },
  {
    id: 499476,
    name: "Anthony",
    image: "https://i.pravatar.cc/48?u=499476",
    balance: 0,
  },
];

export default function App() {
  const friends = initialFriends;
  const [list, setList] = useState(friends);
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState(null);

  function handleAddFriendBtn() {
    setIsOpen((cur) => !cur);
  }

  function handleSelection(friend) {
    setSelected((cur) => (cur?.id === friend.id ? null : friend));
    setIsOpen(false);
  }

  function onSubmitMain(balanceValue) {
    setList((cur) =>
      cur.map((ele) =>
        ele.id === selected.id
          ? { ...ele, balance: ele.balance + balanceValue }
          : ele
      )
    );

    setSelected(null);
  }

  return (
    <div className="app">
      <div className="sidebar">
        <List list={list} onSelection={handleSelection} selected={selected} />

        {isOpen ? (
          <FormAddFriend setList={setList} setIsOpen={setIsOpen} />
        ) : null}

        <Button onClick={handleAddFriendBtn}>
          {isOpen ? "Close" : "Add Friend"}
        </Button>
      </div>

      {selected && (
        <MainForm
          selected={selected}
          setList={setList}
          onSubmitMain={onSubmitMain}
        />
      )}
    </div>
  );
}

function List({ list, onSelection, selected }) {
  return (
    <ul>
      {list.map((friend) => (
        <Friend
          friend={friend}
          key={friend.id}
          onSelection={onSelection}
          selected={selected}
        />
      ))}
    </ul>
  );
}

function Friend({ friend, onSelection, selected }) {
  const isTheSame = selected?.id === friend.id;

  return (
    <li className={isTheSame ? "selected" : ""}>
      <img src={friend.image} alt={`${friend.name} profile pic`} />
      <h3>{friend.name}</h3>
      <p
        className={
          friend.balance < 0 ? "red" : friend.balance > 0 ? "green" : ""
        }
      >
        {friend.balance === 0
          ? `You And ${friend.name} Are Even`
          : friend.balance < 0
          ? `You Owe ${friend.name} ${-friend.balance}$`
          : `${friend.name} Owe You ${friend.balance}$`}
      </p>

      <Button onClick={() => onSelection(friend)}>
        {isTheSame ? "Close" : "Select"}
      </Button>
    </li>
  );
}

function Button({ children, onClick }) {
  return (
    <button className="button" onClick={onClick}>
      {children}
    </button>
  );
}

function FormAddFriend({ setList, setIsOpen }) {
  const [name, setName] = useState("");
  const image = imgs[Math.floor(Math.random() * imgs.length)];

  let newFriend = { id: crypto.randomUUID(), name, image, balance: 0 };

  function addFriend(newFriend) {
    setList((curList) => [...curList, newFriend]);
    setIsOpen(false);
  }

  function handleSubmit(e) {
    e.preventDefault();

    if (!name) return;

    addFriend(newFriend);
    setName("");
  }

  return (
    <form className="form-add-friend" onSubmit={handleSubmit}>
      <label>Friend Name</label>
      <input
        type="text"
        placeholder="Add Friend Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <label>Image Url</label>
      <input type="text" placeholder="Add Friend Image" value={image} />

      <Button>Add</Button>
    </form>
  );
}

function MainForm({ selected, onSubmitMain }) {
  const [billVal, setBillVal] = useState("");
  const [yourExpense, setYourExpense] = useState("");
  const [user, setUser] = useState("user");
  const friendExpense = billVal - yourExpense;

  function handleMainSubmit(e) {
    e.preventDefault();
    if (!billVal || !yourExpense) return;

    onSubmitMain(user === "user" ? friendExpense : -yourExpense);
  }

  return (
    <form className="form-split-bill" onSubmit={handleMainSubmit}>
      <h2>Split Bill With {selected.name}</h2>

      <label>Bill Value</label>
      <input
        type="text"
        placeholder=""
        value={billVal}
        onChange={(e) => setBillVal(Number(e.target.value))}
      />

      <label>Your Expense</label>
      <input
        type="text"
        placeholder=""
        value={yourExpense}
        onChange={(e) =>
          setYourExpense(
            Number(e.target.value) > billVal
              ? yourExpense
              : Number(e.target.value)
          )
        }
      />

      <label>{selected.name}'s Expense</label>
      <input
        type="text"
        placeholder=""
        disabled
        value={billVal ? friendExpense : ""}
      />

      <label>Who Is Paying The Bill</label>
      <select value={user} onChange={(e) => setUser(e.target.value)}>
        <option value="user">You</option>
        <option value="friend">{selected.name}</option>
      </select>

      <Button>Split Bill</Button>
    </form>
  );
}
