
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";
import { collection, addDoc } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";
import { getDocs } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";

// Firebase 구성 정보 설정
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyCoVpfV5XDBzOnKJhrZ8rKGTUBsq6t2MLo",
    authDomain: "sparta-30b87.firebaseapp.com",
    projectId: "sparta-30b87",
    storageBucket: "sparta-30b87.appspot.com",
    messagingSenderId: "635188031181",
    appId: "1:635188031181:web:a0cf496b6e87b0e9140384",
    measurementId: "G-QTCRL8DDDJ"
}

// 팀원 정보 저장 
$("#postingbtn").click(async function () {
    let image = $('#image').val();
    let name = $('#name').val();
    let mbti = $('#mbti').val();
    let merit = $('#merit').val();
    let teamstyle = $('#teamstyle').val();
    let favorite = $('#favorite').val();
    let github = $('#github').val();
    let blog = $('#blog').val();

    let doc = {
        'image': image,
        'name': name,
        'mbti': mbti,
        'merit': merit,
        'teamstyle': teamstyle,
        'favorite': favorite,
        'github': github,
        'blog': blog
    };

    await addDoc(collection(db, "teammate"), doc);
    alert("저장 완료");
    window.location.reload();
    var btn = document.createElement("button");
});

// Firebase 인스턴스 초기화
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
let row = null

//docs 변수 저장
let docs = await getDocs(collection(db, "teammate"));

//팀원 카드 
docs.forEach((doc) => {
    row = doc.data();
    console.log(row)
    let image = row['image'];
    let name = row['name'];
    let mbti = row['mbti'];

    let temp_html = `  <div class="col"  id="${name}" name = "card">
        <div class="card h-100" >
            <img src="${image}" alt="...">
            <div class="card-body">
                <h5 class="card-title">${name}</h5>
                <p class="card-text">${mbti}</p>
            </div>
        </div>
    </div>`;
    $('#myteammate').append(temp_html);
});


$('.col').click(async function () {
    // 클릭한 대상의 이름 가져오는거 확인용 
    var id_check = $(this).attr("id");
    console.log(id_check);

    docs.forEach((doc) => {
        row = doc.data();
        let image = row['image'];
        let name = row['name'];
        let mbti = row['mbti'];
        let merit = row['merit'];
        let teamstyle = row['teamstyle'];
        let favorite = row['favorite'];
        let github = row['github'];
        let blog = row['blog'];

        //모달 바디 생성 
        if (id_check == name) {
            let temp_html2 = `
            <div  id="modal_body" class="screen">
    <div class="container1">
        <h1 class="name" id="modal_name">${name}</h2>
        <button class="exit_btn" id="exit_btn"></button>
    </div>

    <!-- 사진 -->
    <div class="container2">
        <div class="picture"><img src="${image}" alt="..." class = "picture1">
        </div>

        <!-- 자기소개부분 -->
        <div class="tmi">
            <div class="mbti" id="modal_mbti"> ${mbti}</div>
            <div class="merit" id="modal_merit">${merit}</div>
            <div class="teamstyle" id="modal_teamstyle">${teamstyle}</div>
            <div class="favorite" id="modal_favorite">${favorite}</div>
        </div>
    </div>

    <!-- github 및 블로그 주소  -->
    <div class="site_area">
        <button class="github_btn" id="github_btn" button type="button" onclick="location.href='${github}'">
        </button>
        <button class="blog_btn" id="blog_btn" button type="button" onclick="location.href='${blog}'">
        </button>
    </div>
</div>`;
            $('#modal').append(temp_html2);
        }
    })
    
    const btnOpenModal = document.getElementById('myteammate');
    const closeModalBtn = document.getElementById('exit_btn');
    const modal = document.getElementById('modal');
    const modal_body = document.getElementById('modal_body');

    btnOpenModal.addEventListener("click", () => {
        modal.classList.remove('hidden');
        modal_body.classList.add('screen')
    });

    // X버튼으로 모달창 닫기(modal_body 삭제)
    closeModalBtn.addEventListener('click', () => {
        modal_body.remove('modal_body');
        modal.classList.add('hidden');
    });

    //window영역 클릭시 모달창 닫기
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
        modal_body.remove('modal_body');
        modal.classList.add('hidden');
        }
    });
});
