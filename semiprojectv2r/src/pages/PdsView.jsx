import React, {useEffect, useState, useRef} from "react";
import {useParams} from "react-router-dom";
import "../styles/pds.css"


const PdsView = () => {
    const [pdsData, setPdsData] = useState({});
    const params = useParams();
    const pno = params.pno;


    const fetchURL = `http://localhost:8080/api/pds/view/${pno}`;

    //react에서 부수작업side effect을 수행하기 위한 hook
    // 부사작업 : 데이터 가져오기, DOM 조작, 로그
    useEffect(() => {
        fetch(fetchURL, {
            headers: { 'Accept': 'application/json' }
        }).then(res => res.json())
            .then(data => {
                console.log(data);
                setPdsData(data);
            })
            .catch(err => console.log('오류발생!! ', err));
    }, []);

    return (
        <main id="content">
            <h2>자료실 본문글</h2>
            <div className="row offset-1 col-10 my-3">
                <table className="table">
                    <thead>
                    <tr>
                        <td>
                            <button type="button" className="btn btn-light">
                                이전게시물
                            </button>
                            &nbsp;
                            <button type="button" className="btn btn-light">
                                다음게시물
                            </button>
                        </td>
                        <td className="text-end">
                            <button type="button" className="btn btn-primary" id="newbdbtn">
                                새글쓰기
                            </button>
                        </td>
                    </tr>
                    </thead>
                    <tbody>
                    {
                        (!pdsData.pds) ?
                            <tr>
                                <td colSpan="3">본문글이 없어요!!</td>
                            </tr>
                            :
                            <>
                                <tr>
                                    <th className="vtit" colSpan="2">{pdsData.pds.title}</th>
                                </tr>
                                <tr>
                                    <td className="vinfo">{pdsData.pds.userid}</td>
                                    <td className="text-end vinfo">{pdsData.pds.regdate}/{pdsData.pds.thumbs}/{pdsData.pds.views}</td>
                                </tr>
                                <tr>
                                    <td className="vcont pre" colSpan="2">{pdsData.pds.contents}</td>
                                </tr>
                                <tr>
                                    <td colSpan="2">
                                        첨부파일: {
                                        pdsData.pas.map(pa => (
                                            <p key={`fa-${pa.pano}`}><a href=
            {`http://localhost:8080/api/pds/down/${pa.pafname}`}>{pa.pafname}</a> ({pa.pafsize}KB)
                                            </p>
                                        ))
                                    }
                                    </td>
                                </tr>
                            </>
                    }
                    </tbody>
                    <tfoot>
                    <tr>
                        <td>
                            <button type="button" className="btn btn-warning">
                                수정하기
                            </button>
                            &nbsp;
                            <button type="button" className="btn btn-danger" id="rmvbdbtn">
                                삭제하기
                            </button>
                        </td>
                        <td className="text-end">
                            <button type="button" className="btn btn-light" id="lstbdbtn">
                                목록으로
                            </button>
                        </td>
                    </tr>
                    </tfoot>
                </table>

                <div className="my-3">
                    <h3><i className="fa fa-commenting"></i> 나도 한마디</h3>
                </div>

                <table className="table reply-border" data-loginuser="">
                    <tbody>
                    {
                        (pdsData.rps) && pdsData.rps.map(rp => (
                            (rp.rno === rp.ref) ?
                                (<tr key={`reply-${rp.rno}`}>
                                    <td className="text-left">{rp.userid}</td>
                                    <td>
                                        <div className="cmtbg"><span>{rp.regdate}</span>`;
                                            <span className="pushend"><a href="#" data-ref={`${rp.rno}`}
                                                                         data-bs-toggle="modal"
                                                                         data-bs-target="#cmtModal">[추가]</a> [수정] [삭제]</span>
                                        </div>
                                        <p className="py-1 pre">{rp.comments}</p>
                                    </td>
                                </tr>)
                                :
                                (<tr key={`reply-${rp.rno}`}>
                                    <td className="text-left">&nbsp;</td>
                                    <td>
                                        <div className="rpybg"><span>{rp.userid}</span>
                                            <span className="pushend">{rp.regdate}</span></div>
                                        <p className="py-1 pre">{rp.comments}</p></td>
                                </tr>)
                        ))
                    }
                    </tbody>
                </table>

                <div className="py-3">
                    <form className="card card-body bg-light" method="post"
                          name="replyfrm" id="replyfrm">
                        <div className="row align-items-center">
                            <div className="col text-center"><label>abc123</label></div>

                            <div className="col-8"><textarea id="comments" rows="10" name="comments"
                                                             className="form-control col-7"></textarea></div>

                            <div className="col">
                                <button type="button" id="replybtn"
                                        className="btn btn-dark">
                                    <i className="fa fa-commenting"></i> 댓글쓰기
                                </button>
                            </div>
                        </div>
                        <input type="hidden" name="${_csrf.parameterName}" value="${_csrf.token}"/>
                        <input type="hidden" name="userid" value="abc123"/>
                        <input type="hidden" name="pno" value={pno}/>
                    </form>
                </div>

            </div>

            <div className="modal hide" id="cmtModal" role="dialog">
                <div className="modal-dialog" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h3 className="modal-title">대댓글 쓰기</h3>
                        </div>
                        <div className="modal-body">
                            <form name="cmmtfrm" id="cmmtfrm" method="post">
                             <textarea name="comments" id="cmmt" rows="8" cols="60"
                                       className="span4"></textarea>
                                <input type="hidden" name="${_csrf.parameterName}" value="${_csrf.token}"/>
                                <input type="hidden" name="userid" value="abc123"/>
                                <input type="hidden" name="pno" value={pno} />
                                <input type="hidden" name="ref" id="refno"/>
                            </form>
                        </div>
                        <div className="modal-footer justify-content-center">
                            <button type="button" id="cmmtbtn"
                                    className="btn btn-danger">대댓글 작성
                            </button>
                        </div>
                    </div>
                </div>
            </div>

        </main>
    )
}

export default PdsView;