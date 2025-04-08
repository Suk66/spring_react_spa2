import React, {useEffect, useRef, useState} from "react";
import "../styles/pds.css"


const validatePdsForm = (values) => {
    let formErrors = {};

    if(!values.userid) {
        formErrors.userid = '아이디를 입력하세요';
    } else if (values.userid.length < 6) {
        formErrors.userid = '아이디는 6자 이상이어야 합니다';
    }

    if (!values.title) {
        formErrors.title = '글 제목을 입력하세요';
    }

    if (!values.content) {
        formErrors.contents = '본문글을 입력하세요';
    }

    // 파일요소(첨부파일크기) 검사
    console.log(">> pds write ", values.panames.size);
    if (values.paname.size === 0) {
        formErrors.panames = '첨부파일을 추가하세요';
    }

    // 리캡챠 확인 검사
    if (!values["g-recaptcha-response"]) {
        formErrors.recaptcha = "자동가입방지를 확인하세요!!";
    }

    return formErrors;
};

const processPdsok = async (formValues) => {
    fetch('http://localhost:8080/api/pds/write', {
        method: 'POST',
        body: formValues
    }).then(async response => {
        if (response.ok) {
            alert('글쓰기가 완료되었습니다!!');
            location.href = '/pds/list';
        } else if (response.status === 400) {
            alert(await response.text());
        } else {
            alert('자료실 글쓰기에 실패했습니다!! 다시 시도해 주세요!');
        }
    }).catch(error => {
        console.error('error:', error);
        alert('서버와 통신중 오류가 발생했습니다!! 관리자에게 문의하세요!');
    });
};

// PdsWrite 함수 컴포넌트 정의
const PdsWrite = () => {
    const formPdsRef = useRef(null);
    const [errors, setErrors] = useState({});
    const [sitekey, setSitekey] = useState(null);

    const handlePdsSubmit = (e) => {
        e.preventDefault();

        const formData = new FormData(formPdsRef.current);
        const formValues = Object.fromEntries(formData.entries());

        const formErrors = validatePdsForm(formValues);

        if (Object.keys(formErrors).length === 0) {
            processPdsok(formData);
        } else {
            setErrors(formErrors);
            console.log('자료실 글쓰기 실패!!');
        }
    }

    // recaptcha 모듈 적재
    useEffect(() => {
        const script = document.createElement('script');
        script.src = 'https://www.google.com/recaptcha/api.js';
        script.async = true;
        script.defer = true;
        document.body.appendChild(script);

        const site_key =import.meta.env.VITE_APP_RECAPTCHA_SITEKEY;
        setSitekey(site_key);
    }, []);

    return (
        <main id="content">
            <h2>자료실 글쓰기</h2>
            <form name="pdsfrm" id="pdsfrm" method="post"
                  ref={formPdsRef} onSubmit={handlePdsSubmit} noValidate>
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
                    <input type="file" name="panames" id="panames"
                           className={`form-control h-100 ${errors.panames ? 'is-invalid' : ''}`}
                           multiple required />
                    {errors.panames && <div className="invalid-feedback">{errors.panames}</div>}
                </div>

                <div className="my-2 d-flex justify-content-center">
                    <div className="g-recaptcha" id="recaptcha"
                         data-sitekey={sitekey}></div>
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

export default PdsWrite;