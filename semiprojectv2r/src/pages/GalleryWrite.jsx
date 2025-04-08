import React, {useEffect, useRef, useState} from "react";
import "../styles/Gallery.css"

const validateGalleryForm = (values) => {
    let formErrors = {};

    if (!values.userid) {
        formErrors.userid = '아이디를 입력하세요';
    } else if (values.userid.length < 6) {
        formErrors.userid = '아이디는 6자 이상이어야 합니다';
    }

    if (!values.title) {
        formErrors.title = '글 제목을 입력하세요';
    }

    if (!values.contents) {
        formErrors.contents = '본문글을 입력하세요';
    }

    // 파일요소 ( 첨부파일크기 ) 검사
    console.log(">> gallery write ", values.ginames.size);
    if (values.ginames.size === 0) {
        formErrors.contents = '이미지 파일을 첨부하세요';
    }

    // 리캡챠 확인 검사
    if (!values["g-recaptcha-response"]) {
        formErrors.recaptcha = "자동가입방지를 확인하세요!!";
    }

    return formErrors;
};

const processGalleryok = async (formValues) => {
    fetch('http://localhost:8080/api/gallery/write', {
        method: 'POST',
        body: formValues
    }).then(async response => {
        if (response.ok) {
            alert('글쓰기가 완료되었습니다!!');
            location.href = '/Gallery/list';
        } else if (response.status === 400) {
            alert(await response.text());
        } else {
            alert('갤러리 글쓰기에 실패했습니다!! 다시 시도해 주세요!');
        }
    }).catch(error => {
        console.error('error:', error);
        alert('서버와 통신중 오류가 발생했습니다!! 관리자에게 문의하세요!');
    });
};

// GalleryWrite 함수 컴포넌트 정의
const GalleryWrite = () => {
    const formGalleryRef = useRef(null);
    const [errors, setErrors] = useState({});
    const [sitekey, setSitekey] = useState(null);

    const handleGallerySubmit = (e) => {
        e.preventDefault();

        const formData = new FormData(formGalleryRef.current);
        const formValues = Object.fromEntries(formData.entries());

        const formErrors = validateGalleryForm(formValues);

        if (Object.keys(formErrors).length === 0) {



            // cowmeat01.jpg => cowmeat01_small.jpg
            const fname = formData.getAll("ginames")[0].name.split('.');
            const tfname = `${fname[0]}_small.${fname[1]}`;
            // console.log(">> tfname : ", tfname);
            formData.set("simgname", tfname);   // 요소명, 값

            // console.log(">> formData : ", formData);         실질적으로 서버에 넘길 때는 formData 사용
            // console.log(">> formValues : ", formValues);     유혀성 검사때는 formValues로 넘기는데

            processGalleryok(formData);
        } else {
            setErrors(formErrors);
            console.log('갤러리 글쓰기 실패!!');
        }
    }

    // recaptcha 모듈 적재
    useEffect(() => {
        const script = document.createElement('script');
        script.src = 'https://www.google.com/recaptcha/api.js';
        script.async = true;
        script.defer = true;
        document.body.appendChild(script);

        const site_key = import.meta.env.VITE_APP_RECAPTCHA_SITE_KEY;   // 에러시 이부분 확인.
        setSitekey(site_key);

    }, []);



    return (
        <main id="content">
            <h2>갤러리 글쓰기</h2>
            <form name="galleryfrm" id="galleryfrm" method="post"
                  ref={formGalleryRef} onSubmit={handleGallerySubmit} noValidate>
                <div className="form-floating my-2">
                    <input type="text" name="userid" id="userid"
                           className={`form-control ${errors.userid ? 'is-invalid' : ''}`}
                           placeholder="아이디" readOnly value="abc123"/>
                    <label htmlFor="userid" className="form-label">아이디</label>
                    {errors.userid && <div className="invalid-feedback">{errors.userid}</div>}
                </div>

                <div className="form-floating my-2">
                    <input type="text" name="title" id="title"
                           className={`form-control ${errors.title ? 'is-invalid' : ''}`}
                           placeholder="제목" required/>
                    <label htmlFor="title" className="form-label">제목</label>
                    {errors.title && <div className="invalid-feedback">{errors.title}</div>}
                </div>

                <div className="form-floating my-2">
                    <textarea name="contents" id="contents"
                              className={`form-control h-100 ${errors.contents ? 'is-invalid' : ''}`}
                              rows="10" placeholder="본문글" required></textarea>
                    <label htmlFor="contents" className="form-label">본문글</label>
                    {errors.contents && <div className="invalid-feedback">{errors.contents}</div>}
                </div>

                <div className="my-2">
                    <input type="file" name="ginames" id="ginames"
                           className={`form-control h-100 ${errors.contents ? 'is-invalid' : ''}`}
                           multiple required/>
                    <input type="hidden" name="simgname" id="simgname"/>
                    {errors.ginames && <div className="invalid-feedback">{errors.ginames}</div>}

                </div>


                <div className="my-2 d-flex justify-content-center">
                    <div className="g-recaptcha" id="recaptcha"
                         data-sitekey="{sitekey}"></div>
                </div>
                {errors.recaptcha && <div className="alert alert-danger">{errors.recaptcha}</div>}

                <div className="my-2 d-flex justify-content-between">
                    <button type="submit" className="btn btn-primary">
                        <i className="fa-sharp fa-solid fa-file-signature"></i> 입력완료
                    </button>
                    <button type="reset" className="btn btn-danger">
                        <i className="fa-sharp fa-solid fa-eraser"></i> 다시입력
                    </button>
                </div>
            </form>
        </main>
    )
}

export default GalleryWrite;
