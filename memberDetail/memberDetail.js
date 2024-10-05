
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";
import { collection, addDoc } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";
import { getDocs } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";
import { ref, getStorage, getDownloadURL, uploadBytes } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-storage.js";

// Firebase 구성 정보 설정
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyBms7sqsM8g7vrzSmF1Wae5fqeTZxuYLjM",
    authDomain: "sparta-37f76.firebaseapp.com",
    projectId: "sparta-37f76",
    storageBucket: "sparta-37f76.appspot.com",
    messagingSenderId: "393070149156",
    appId: "1:393070149156:web:5a20139a0651e2f52422b1",
    measurementId: "G-RLE2RQ3YE4"
};

// Firebase 인스턴스 초기화
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

// 팀원 정보 저장 
$("#register").click(async function () {
    var file = document.querySelector('#image').files[0];
    var imageRef = ref(storage, `images/${file.name}`);
    console.log('imageRef: ', imageRef);
    var upload = await uploadBytes(imageRef, file);
    console.log('upload: ', upload);
    const imageURL = await getDownloadURL(imageRef);
    console.log('imageURL: ', imageURL);

    let name = $('#name').val();
    let pwd = $('#pwd').val();
    let mbti = $('#mbti').val();
    let strength = $('#strength').val();
    let style = $('#style').val();
    let like = $('#like').val();
    let github = $('#github').val();
    let blog = $('#blog').val();

    let doc = {
        'image': imageURL,
        'name': name,
        'pwd': pwd,
        'mbti': mbti,
        'strength': strength,
        'style': style,
        'like': like,
        'github': github,
        'blog': blog
    };

    await addDoc(collection(db, "members"), doc);
    alert("저장 완료");
    window.location.reload();
});


//***************** 마지막에 teammate members로 변경*/


//docs 변수 저장
let docs = await getDocs(collection(db, "members"));
let row = null
//팀원 카드 
docs.forEach((doc) => {
    row = doc.data();
    console.log(row)
    let image = row['image'];
    let name = row['name'];
    let mbti = row['mbti'];

    let temp_html = `  <div class="col"  id="${name}" >
        <div class="card h-100" >
            <div class="card-body" >
                <img src="${image}" class="card-img" alt="...">
                <h5 class="card-title">${name}</h5>
                <p class="card-mbti">${mbti}</p>
            </div>
        </div>
    </div>`;
    $('#card').append(temp_html);
});


$('.col').click(async function () {
    // 클릭한 대상의 이름 가져오는거 확인용 
    var id_check = $(this).attr("id");
    console.log(id_check);


    
    docs.forEach((doc) => {
        row = doc.data();
        let image = row['image'];
        let name = row['name'];
        let pwd = row['pwd'];
        let mbti = row['mbti'];
        let strength = row['strength'];
        let style = row['style'];
        let like = row['like'];
        let github = row['github'];
        let blog = row['blog'];

        //모달 바디 생성 
        if (id_check == name) {
            let temp_html2 = `
            <div  id="modalContainer_body" class="screen">
    <div class="container1">
        <h1 class="name" id="modalContainer_name">${name}</h2>
        <button class="modalCloseBtn" id="modalCloseBtn"></button>
    </div>

    <!-- 사진 -->
    <div class="container2">
        <div class="picture"><img src="${image}" alt="..." class = "picture1">
        </div>

        <!-- 자기소개부분 -->
        <div class="tmi">
            <div class="mbti" id="modalContainer_mbti">MBTI : ${mbti}</div>
            <div class="strength" id="modalContainer_strength">장점 :${strength}</div>
            <div class="style" id="modalContainer_style">협업스타일 :${style}</div>
            <div class="like" id="modalContainer_like">좋아하는것 : ${like}</div>
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
            $('#modalContainer').append(temp_html2);
        }
    })

    const btnOpenmodalContainer = document.getElementById('card');
    const closemodalContainerBtn = document.getElementById('modalCloseBtn');
    const modalContainer = document.getElementById('modalContainer');
    const modalContainer_body = document.getElementById('modalContainer_body');

    btnOpenmodalContainer.addEventListener("click", () => {
        modalContainer.classList.remove('hidden');
        modalContainer_body.classList.add('screen')
    });

    // X버튼으로 모달창 닫기(modalContainer_body 삭제)
    closemodalContainerBtn.addEventListener('click', () => {
        modalContainer.classList.add('hidden');
        modalContainer_body.remove('modalContainer_body');
    });

    //window영역 클릭시 모달창 닫기
    window.addEventListener('click', (e) => {
        if (e.target === modalContainer) {
            modalContainer_body.remove('modalContainer_body');
            modalContainer.classList.add('hidden');
        }
    });
});
