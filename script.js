import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";
import { getFirestore, doc, getDoc, deleteDoc, updateDoc } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";
import { collection, addDoc, getDocs } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";

// Firebase 초기화
const firebaseConfig = {
    apiKey: "AIzaSyAqxcqqQIHSqrirzzGeotQJ1sXsAV8owKc",
    authDomain: "sparta-bffcc.firebaseapp.com",
    projectId: "sparta-bffcc",
    storageBucket: "sparta-bffcc.appspot.com",
    messagingSenderId: "113944677662",
    appId: "1:113944677662:web:a16df1a90fb01734ca8d0f",
    measurementId: "G-PNPYF3WLV6"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// 데이터 추가
$("#postingbtn").click(async function () {
    let member_pw = $('#member_pw').val();
    let member_name = $('#member_name').val();
    let member_mbti = $('#member_mbti').val();
    let member_git = $('#member_git').val();
    let member_blog = $('#member_blog').val();
    let member_strength = $('#member_strength').val();
    let member_style = $('#member_style').val();
    let member_favorate = $('#member_favorate').val();

    try {
        const docRef = await addDoc(collection(db, "teampage"), {
            member_pw,
            member_name,
            member_mbti,
            member_git,
            member_blog,
            member_strength,
            member_style,
            member_favorate
        });
        alert("멤버가 추가되었습니다!");
        window.location.reload();
    } catch (e) {
        console.error("Error adding document: ", e);
    }
});

// 데이터 읽기 및 카드 추가
const querySnapshot = await getDocs(collection(db, "teampage"));
querySnapshot.forEach((doc) => {
    let member_name = doc.data().member_name;
    let member_mbti = doc.data().member_mbti;
    let member_git = doc.data().member_git;
    let member_blog = doc.data().member_blog;
    let member_strength = doc.data().member_strength;
    let member_style = doc.data().member_style;
    let member_favorate = doc.data().member_favorate;

    let temp_html = ` 
    <div class="col">
        <div class="card">
            <div class="card-header">
                <input type="text" class="form-control" id="edit_pw_${doc.id}" placeholder="****">
                <button class="btn btn-sm btn-outline-secondary float-right editbtn" data-id="${doc.id}">수정</button>
                <button class="btn btn-sm btn-outline-danger float-right deletebtn" data-id="${doc.id}">삭제</button>
            </div>
            <img src="https://gongtalk.co.kr/profile_basic.jpeg" class="card-img-top" alt="Profile Image">
            <div class="card-body">
                <h5 class="card-title">${member_name}</h5>
                <p class="card-text">MBTI: ${member_mbti}</p>
                <p class="card-text">Strength: ${member_strength}</p>
                <p class="card-text">Collaboration Style: ${member_style}</p>
                <p class="card-text">Favorites: ${member_favorate}</p>
            </div>
            <div class="card-footer text-center">
                <a href="${member_git}" target="_blank" class="social-icon">
                    <img src="https://cdn-icons-png.flaticon.com/512/25/25231.png" alt="GitHub" style="width:30px; height:30px; border-radius:50%;">
                </a>
                <a href="${member_blog}" target="_blank" class="social-icon">
                    <img src="https://cdn-icons-png.flaticon.com/512/732/732200.png" alt="Blog" style="width:30px; height:30px; border-radius:50%;">
                </a>
            </div>
        </div>
    </div>`;
    $("#member-cards").append(temp_html);
});

// 삭제 이벤트 처리
$(document).on("click", ".deletebtn", async function () {
    const docId = $(this).data('id'); // 클릭된 버튼에서 데이터 ID 가져오기
    const inputPw = $(`#edit_pw_${docId}`).val(); // 입력된 비밀번호 가져오기

    const docRef = doc(db, "teampage", docId); // 문서 참조 가져오기
    const docSnapshot = await getDoc(docRef); // 문서 데이터 가져오기

    if (docSnapshot.exists()) {
        const storedPw = docSnapshot.data().member_pw;

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

    const docRef = doc(db, "teampage", docId);
    const docSnapshot = await getDoc(docRef);

    if (docSnapshot.exists()) {
        const storedPw = docSnapshot.data().member_pw;

        console.log(docId);
        console.log(inputPw);
        console.log(docRef);
        console.log(storedPw);

        // 비밀번호가 일치하는지 확인
        if (inputPw === storedPw) {
            // postingbox를 visible로 변경
            $('#postingbox').css('display', 'block');

            // input 필드에 기존 데이터를 채움
            $('#member_pw').val(docSnapshot.data().member_pw);
            $('#member_name').val(docSnapshot.data().member_name);
            $('#member_mbti').val(docSnapshot.data().member_mbti);
            $('#member_git').val(docSnapshot.data().member_git);
            $('#member_blog').val(docSnapshot.data().member_blog);
            $('#member_strength').val(docSnapshot.data().member_strength);
            $('#member_style').val(docSnapshot.data().member_style);
            $('#member_favorate').val(docSnapshot.data().member_favorate);

            // "등록하기" 버튼을 "수정하기" 버튼으로 변경
            $("#postingbtn").hide(); // 등록하기 버튼 숨기기
            if (!$("#editbtn_submit").length) {
                const editButton = `<button id="editbtn_submit" class="btn btn-primary">수정하기</button>`;
                $("#postingbox").append(editButton); // 수정하기 버튼 추가
            }

            // 수정하기 버튼 클릭 시 기존 데이터 업데이트
            $("#editbtn_submit").off('click').on("click", async function () {
                const updatedData = {
                    member_pw: $('#member_pw').val(),
                    member_name: $('#member_name').val(),
                    member_mbti: $('#member_mbti').val(),
                    member_git: $('#member_git').val(),
                    member_blog: $('#member_blog').val(),
                    member_strength: $('#member_strength').val(),
                    member_style: $('#member_style').val(),
                    member_favorate: $('#member_favorate').val()
                };

                try {
                    // 문서 업데이트
                    await updateDoc(docRef, updatedData);
                    alert("멤버 정보가 수정되었습니다.");
                    window.location.reload(); // 수정 후 페이지 새로고침
                } catch (e) {
                    console.error("Error updating document: ", e);
                }
            });

            
            // "내용지우기" 버튼을 "원래대로" 버튼으로 변경
            $("#postingcancelbtn").hide(); // 내용지우기 버튼 숨기기
            if (!$("#editbtn_recover").length) {
                const recoverButton = `<button id="editbtn_recover" class="btn btn-primary">원래대로</button>`;
                $("#postingbox").append(recoverButton); // 수정하기 버튼 추가
            }

            // 원래대로 버튼 클릭 시 수정 폼 값을 DB의 값으로 복원
            $("#editbtn_recover").off('click').on("click", async function () {
                $('#member_pw').val(docSnapshot.data().member_pw);
                $('#member_name').val(docSnapshot.data().member_name);
                $('#member_mbti').val(docSnapshot.data().member_mbti);
                $('#member_git').val(docSnapshot.data().member_git);
                $('#member_blog').val(docSnapshot.data().member_blog);
                $('#member_strength').val(docSnapshot.data().member_strength);
                $('#member_style').val(docSnapshot.data().member_style);
                $('#member_favorate').val(docSnapshot.data().member_favorate);
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

$("#savebtn").click(async function () {
    $('#postingbox').toggle();
})