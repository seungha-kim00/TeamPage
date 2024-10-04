    // Firebase SDK 라이브러리 가져오기
    import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";
    import { getFirestore } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";
    import { collection, addDoc } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";
    import { getDocs } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";
    import { ref, getStorage, getDownloadURL, uploadBytes } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-storage.js";


    // For Firebase JS SDK v7.20.0 and later, measurementId is optional 구성정보
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


    $("#register").click(async function () {

        var file = document.querySelector('#image').files[0];
        var imageRef = ref(storage, `images/${file.name}`);
        console.log('imageRef: ', imageRef);
        var upload = await uploadBytes(imageRef, file);
        console.log('upload: ', upload);
        const imageURL = await getDownloadURL(imageRef);
        console.log('imageURL: ', imageURL);

        let name = $('#name').val();
        let mbti = $('#mbti').val();
        let strength = $('#strength').val();
        let style = $('#style').val();
        let like = $('#like').val();
        let github = $('#github').val();
        let blog = $('#blog').val();


        let doc = {
            'image': imageURL,
            'name': name,
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
            <img src="${image}" class="card-img" alt="...">
              <h5 class="card-title text-center mb-3">${name}</h5>
              <p class="card-mbti text-center">${mbti}</p>
                    </div>
        </div>`;
        $('#card').append(temp_html);

    });
    $("#close").click(async function () {
        $('#postingbox').toggle();
    })

    const modalOpenBtn = document.getElementById('card');
    const modalCloseBtn = document.getElementById('modalCloseBtn');
    const modal = document.getElementById('modalContainer');

    modalOpenBtn.addEventListener('click', () => {
        modal.classList.remove('hidden');
    });

    modalCloseBtn.addEventListener('click', () => {
        modal.classList.add('hidden');
    });