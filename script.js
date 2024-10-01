// Handle pop-up display
const popup = document.getElementById('member-popup');
const openPopupBtn = document.getElementById('open-popup-btn');
const closePopupBtn = document.querySelector('.close-btn');
const memberForm = document.getElementById('member-form');
const memberCards = document.getElementById('member-cards');
let members = [];  // To keep track of members

// Open popup when button clicked
openPopupBtn.addEventListener('click', () => {
    document.getElementById('edit-index').value = '-1';  // Reset form for new member
    memberForm.reset();
    popup.style.display = 'flex';
});

// Close popup
closePopupBtn.addEventListener('click', () => {
    popup.style.display = 'none';
});

// Add or edit member
memberForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const name = document.getElementById('popup-name').value;
    const mbti = document.getElementById('popup-mbti').value;
    const photoFile = document.getElementById('popup-photo').files[0];
    const editIndex = document.getElementById('edit-index').value;

    const reader = new FileReader();
    reader.onload = function(e) {
        const photoSrc = e.target.result;

        if (editIndex === '-1') {
            // Add new member
            const member = { name, mbti, photoSrc };
            members.push(member);
        } else {
            // Edit existing member
            members[editIndex].name = name;
            members[editIndex].mbti = mbti;
            if (photoFile) {
                members[editIndex].photoSrc = photoSrc;
            }
        }

        renderMembers();
        popup.style.display = 'none';
    };

    if (photoFile) {
        reader.readAsDataURL(photoFile);
    } else {
        // If no new photo is selected, proceed without reading a new file
        if (editIndex !== '-1') {
            renderMembers();
            popup.style.display = 'none';
        }
    }
});

// Render members on the page
function renderMembers() {
    memberCards.innerHTML = '';
    members.forEach((member, index) => {
        const memberCard = document.createElement('div');
        memberCard.classList.add('member-card');
        memberCard.innerHTML = `
            <img src="${member.photoSrc}" alt="${member.name}'s photo" style="width:100px; height:100px;">
            <h4>${member.name}</h4>
            <p>MBTI: ${member.mbti}</p>
            <button onclick="editMember(${index})">Edit</button>
        `;
        memberCards.appendChild(memberCard);
    });
}

// Edit member
function editMember(index) {
    const member = members[index];
    document.getElementById('popup-name').value = member.name;
    document.getElementById('popup-mbti').value = member.mbti;
    document.getElementById('edit-index').value = index;
    popup.style.display = 'flex';
}
