import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";
import { getFirestore, doc, getDoc, deleteDoc, updateDoc } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";
import { collection, addDoc, getDocs } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";

import { ref, getStorage, getDownloadURL, uploadBytes } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-storage.js";

// import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";
// import { getFirestore } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";
// import { collection, addDoc } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";
// import { getDocs } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";
// import { ref, getStorage, getDownloadURL, uploadBytes } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-storage.js";


// Firebase 초기화
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyAqxcqqQIHSqrirzzGeotQJ1sXsAV8owKc",
    authDomain: "sparta-bffcc.firebaseapp.com",
    projectId: "sparta-bffcc",
    storageBucket: "sparta-bffcc.appspot.com",
    messagingSenderId: "113944677662",
    appId: "1:113944677662:web:a16df1a90fb01734ca8d0f",
    measurementId: "G-PNPYF3WLV6"

    // 예지님 코드
    // apiKey: "AIzaSyBms7sqsM8g7vrzSmF1Wae5fqeTZxuYLjM",
    // authDomain: "sparta-37f76.firebaseapp.com",
    // projectId: "sparta-37f76",
    // storageBucket: "sparta-37f76.appspot.com",
    // messagingSenderId: "393070149156",
    // appId: "1:393070149156:web:5a20139a0651e2f52422b1",
    // measurementId: "G-RLE2RQ3YE4"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

// 데이터 추가
// new version
$("#register").click(async function () {
    // 멤버 이미지 추가
    var file = document.querySelector('#image').files[0];
    var imageRef = ref(storage, `images/${file.name}`);
    console.log('imageRef: ', imageRef);
    var upload = await uploadBytes(imageRef, file);
    console.log('upload: ', upload);
    const imageURL = await getDownloadURL(imageRef);
    console.log('imageURL: ', imageURL);

    // 멤버 정보 추가
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
    alert('저장 완료!');
    window.location.reload();
})

// 데이터 읽기 및 카드 추가
// new version
let docs = await getDocs(collection(db, "members"));
docs.forEach((doc) => {
    let row = doc.data();

    let image = row['image'];
    let name = row['name'];
    let mbti = row['mbti'];
    let strength = row['strength'];
    let style = row['style'];
    let like = row['like'];
    let github = row['github'];
    let blog = row['blog'];

    // <p class="card-text">mbti: ${mbti}</p>
    //              <p class="card-text">장점: ${strength}</p>                      
    // <p class="card-text">협업 스타일: ${style}</p>
    // <p class="card-text">좋아하는 것: ${like}</p>
    //               <p class="card-text">github 주소: ${github}</p>
    // <p class="card-text">blog 주소: ${blog}</p>

    let temp_html = `
            <div class="col">
                <div class="card h-100">
                    <div class="card-header">
                        <input type="text" class="form-control" id="edit_pw_${doc.id}" placeholder="****">
                        <button class="btn btn-sm btn-outline-secondary float-right editbtn" data-id="${doc.id}">수정</button>
                        <button class="btn btn-sm btn-outline-danger float-right deletebtn" data-id="${doc.id}">삭제</button>
                        <a href="${github}" target="_blank" class="social-icon">
                            <img src="https://cdn-icons-png.flaticon.com/512/25/25231.png" alt="GitHub" style="width:30px; height:30px; border-radius:50%;">
                        </a>
                        <a href="${blog}" target="_blank" class="social-icon">
                            <img src="https://cdn-icons-png.flaticon.com/512/732/732200.png" alt="Blog" style="width:30px; height:30px; border-radius:50%;">
                        </a>
                    </div>
                    <img src="${image}" class="card-img" alt="...">
                    <h5 class="card-title text-center mb-3">${name}</h5>
                    <p class="card-mbti text-center">${mbti}</p>
                </div>
            </div>`;
    $('#card').append(temp_html);

});


// 삭제 이벤트 처리
$(document).on("click", ".deletebtn", async function () {
    const docId = $(this).data('id'); // 클릭된 버튼에서 데이터 ID 가져오기
    const inputPw = $(`#edit_pw_${docId}`).val(); // 입력된 비밀번호 가져오기

    const docRef = doc(db, "members", docId); // 문서 참조 가져오기
    const docSnapshot = await getDoc(docRef); // 문서 데이터 가져오기

    if (docSnapshot.exists()) {
        const storedPw = docSnapshot.data().pwd;

        console.log(docId);
        console.log(inputPw);
        console.log(docRef);
        console.log(storedPw);

        // 비밀번호가 일치하는지 확인
        if (inputPw === storedPw) {
            await deleteDoc(docRef); // 문서 삭제
            alert("멤버가 삭제되었습니다.");
            window.location.reload(); // 삭제 후 페이지 새로고침
        } else {
            alert("비밀번호가 일치하지 않습니다.");
        }
    } else {
        alert("해당 문서를 찾을 수 없습니다.");
    }
});


// 수정 버튼 클릭 시 비밀번호 확인 및 데이터 불러오기
$(document).on("click", ".editbtn", async function () {
    const docId = $(this).data('id'); // 버튼의 data-id 가져오기
    const inputPw = $(`#edit_pw_${docId}`).val(); // 해당하는 입력 필드의 값 가져오기

    const docRef = doc(db, "members", docId);
    const docSnapshot = await getDoc(docRef);

    if (docSnapshot.exists()) {
        const storedPw = docSnapshot.data().pwd;

        console.log(docId);
        console.log(inputPw);
        console.log(docRef);
        console.log(storedPw);

        // 비밀번호가 일치하는지 확인
        if (inputPw === storedPw) {
            // postingbox를 visible로 변경
            $('#postingbox').css('display', 'block');

            // input 필드에 기존 데이터를 채움
            $('#name').val(docSnapshot.data().name);
            $('#pwd').val(docSnapshot.data().pwd);
            $('#mbti').val(docSnapshot.data().mbti);
            $('#strength').val(docSnapshot.data().strength);
            $('#style').val(docSnapshot.data().style);
            $('#like').val(docSnapshot.data().like);
            $('#github').val(docSnapshot.data().github);
            $('#blog').val(docSnapshot.data().blog);

            // "등록하기" 버튼을 "수정하기" 버튼으로 변경
            $("#register").hide(); // 등록하기 버튼 숨기기
            if (!$("#editbtn_submit").length) {
                const editButton = `<button id="editbtn_submit" class="btn btn-primary">수정하기</button>`;
                $("#postingbox").append(editButton); // 수정하기 버튼 추가
            }

            // 수정하기 버튼 클릭 시 기존 데이터 업데이트
            $("#editbtn_submit").off('click').on("click", async function () {
                console.log($('#image').val() == '');
                console.log($('#image').val());

                if ($('#image').val() == '') {
                    const updatedData = {
                        // image: $('#image').val(),
                        pwd: $('#pwd').val(),
                        name: $('#name').val(),
                        mbti: $('#mbti').val(),
                        github: $('#github').val(),
                        blog: $('#blog').val(),
                        strength: $('#strength').val(),
                        style: $('#style').val(),
                        like: $('#like').val()
                    };

                    try {
                        // 문서 업데이트
                        await updateDoc(docRef, updatedData);
                        alert("멤버 정보가 수정되었습니다.");
                        window.location.reload(); // 수정 후 페이지 새로고침
                    } catch (e) {
                        console.error("Error updating document: ", e);
                    }
                }
                else {
                    // 멤버 이미지 추가
                    var file = document.querySelector('#image').files[0];
                    var imageRef = ref(storage, `images/${file.name}`);
                    console.log('imageRef: ', imageRef);
                    var upload = await uploadBytes(imageRef, file);
                    console.log('upload: ', upload);
                    const imageURL = await getDownloadURL(imageRef);
                    console.log('imageURL: ', imageURL);

                    const updatedData = {
                        image: imageURL,
                        pwd: $('#pwd').val(),
                        name: $('#name').val(),
                        mbti: $('#mbti').val(),
                        github: $('#github').val(),
                        blog: $('#blog').val(),
                        strength: $('#strength').val(),
                        style: $('#style').val(),
                        like: $('#like').val()
                    };

                    try {
                        // 문서 업데이트
                        await updateDoc(docRef, updatedData);
                        alert("멤버 정보가 수정되었습니다.");
                        window.location.reload(); // 수정 후 페이지 새로고침
                    } catch (e) {
                        console.error("Error updating document: ", e);
                    }
                }
            });


            // "내용지우기" 버튼을 "원래대로" 버튼으로 변경
            $("#close").hide(); // 내용지우기 버튼 숨기기
            if (!$("#editbtn_recover").length) {
                const recoverButton = `<button id="editbtn_recover" class="btn btn-primary">원래대로</button>`;
                $("#postingbox").append(recoverButton); // 수정하기 버튼 추가
            }

            // 원래대로 버튼 클릭 시 수정 폼 값을 DB의 값으로 복원
            $("#editbtn_recover").off('click').on("click", async function () {
                $('#image').val('');
                $('#fileName').val('');
                // document.querySelector('#image').files[0] = '';
                $('#pwd').val(docSnapshot.data().pwd);
                $('#name').val(docSnapshot.data().name);
                $('#mbti').val(docSnapshot.data().mbti);
                $('#github').val(docSnapshot.data().github);
                $('#blog').val(docSnapshot.data().blog);
                $('#strength').val(docSnapshot.data().strength);
                $('#style').val(docSnapshot.data().style);
                $('#like').val(docSnapshot.data().like);
            });


            if (!$("#editbtn_cancel").length) {
                const cancelButton = `<button id="editbtn_cancel" class="btn btn-primary">취소</button>`;
                $("#postingbox").append(cancelButton); // 수정하기 버튼 추가
            }

            // 취소 버튼 클릭 시 페이지 새로고침
            $("#editbtn_cancel").off('click').on("click", async function () {
                try {
                    // 문서 업데이트
                    alert("멤버 정보 수정이 취소되었습니다.");
                    window.location.reload(); // 페이지 새로고침
                } catch (e) {
                    console.error("Error updating document: ", e);
                }
            });

        } else {
            alert("비밀번호가 일치하지 않습니다.");
        }
    } else {
        alert("해당 문서를 찾을 수 없습니다.");
    }
});


// 등록 폼 토글
// new version
$("#close").click(async function () {
    $('#postingbox').toggle();
})

// old version
// $("#savebtn").click(async function () {
//     $('#postingbox').toggle();
// })





const modalOpenBtn = document.getElementById('individual');
const modalCloseBtn = document.getElementById('modalCloseBtn');
const modal = document.getElementById('modalContainer');

modalOpenBtn.addEventListener('click', () => {
    modal.classList.remove('hidden');
});

modalCloseBtn.addEventListener('click', () => {
    modal.classList.add('hidden');
});
