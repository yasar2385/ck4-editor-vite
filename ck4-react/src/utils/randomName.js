const adjectives = [
    "Crimson", "Azure", "Golden", "Silent", "Frosty", "Misty", "Lunar",
    "Cosmic", "Shadow", "Bright", "Stormy", "Emerald", "Silver", "Wild", "Blazing"
];

const animals = [
    "Fox", "Hawk", "Wolf", "Tiger", "Lion", "Eagle", "Panda",
    "Falcon", "Bear", "Otter", "Dolphin", "Dragon", "Leopard", "Raven", "Deer"
];

export default function getRandomName() {
    const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
    const ani = animals[Math.floor(Math.random() * animals.length)];
    return `${adj}${ani}`;
}
