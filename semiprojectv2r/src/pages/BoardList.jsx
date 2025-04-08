import React, {useEffect, useState, useRef} from "react";
import {useParams} from "react-router-dom";
import "../styles/board.css"

// BoardList 함수 컴포넌트 정의
const BoardList = () => {
    const [boardData, setBoardData] = useState({});
    // useRef : 특정 DOM요소에 접근하기 위해 사용하는 리액트 hook
    const ftypeRef = useRef(null);
    const fkeyRef = useRef(null);

    // 엔드포인트에서 path 변수 추출
    // useParams : URL 경로상의 정의된 매개변수로 값을 추출
    const params = useParams();
    const cpg = params.cpg;
    const ftype = params.ftype || null;
    const fkey = params.fkey || null;
    console.log(cpg, ftype, fkey);

    const pglink = (fkey === null) ?
        `/board/list/` : `/board/find/${ftype}/${fkey}/`;

    const fetchURL = `http://localhost:8080/api${pglink}${cpg}`;

    // react에서 부수작업side effect을 수행하기 위한 hook
    // 부수작업 : 데이터 가져오기, DOM 조작, 로그
    useEffect(() => {
        fetch(fetchURL, {
            headers: { 'Accept': 'application/json' }
        }).then(res => res.json())
        .then(data => {
            console.log(data);
            setBoardData(data);
        })
        .catch(err => console.log('오류발생!! ', err));
    }, []);

    const goBoardWrite = () => {
        location.href = '/board/write';
    };

    const goBoardFind = () => {
        const findtype = ftypeRef.current.value;
        const findkey = fkeyRef.current.value;
        location.href = `/board/find/${findtype}/${findkey}/${cpg}`;
    };

    return (
        <main id="content">
            <h2>게시판</h2>
            <table className="table table-striped">
                <colgroup>
                    <col style={{width:"7%"}} />
                    <col className="truncate"/>
                    <col style={{width:"12%"}} />
                    <col style={{width:"12%"}} />
                    <col style={{width:"7%"}} />
                    <col style={{width:"7%"}} />
                </colgroup>

                <thead>
                <tr>
                    <td colSpan="3" className="text-start">
                        <div className="d-flex align-items-center gap-3">
                            <select className="form-select" style={{width: "120px"}}
                                    id="findtype" name="findtype" defaultValue="title" ref={ftypeRef}>
                                <option value="title">제목</option>
                                <option value="userid">작성자</option>
                                <option value="contents">내용</option>
                            </select>
                            <input className="form-control" style={{width: "250px"}}
                                   id="findkey" name="findkey"  ref={fkeyRef} />
                            <button className="btn btn-success" id="findbtn" onClick={goBoardFind}>
                                <i className="fa-solid fa-magnifying-glass" /> 검색
                            </button>
                        </div>
                    </td>
                    <td colSpan="3" className="text-end">
                        <button type="button" className="btn btn-primary"
                                id="newbdbtn" onClick={goBoardWrite}>
                            <i className="fas fa-pen" /> 글쓰기
                        </button>

                        <button type="button" className="btn btn-primary"
                                id="newpdsbtn" onClick={goPdsWrite}>
                            <i className="fas fa-pen" /> 자료실 글쓰기
                        </button>
                    </td>
                </tr>
                <tr className="table-light">
                    <th>번호</th>
                    <th>제목</th>
                    <th>작성자</th>
                    <th>작성일</th>
                    <th>추천</th>
                    <th>조회</th>
                </tr>
                </thead>

                <tbody>
                {
                    (!Array.isArray(boardData.bdlist) || boardData.bdlist.length === 0) ?
                        <tr><td colSpan="6">게시글이 없어요!!</td></tr>
                        :
                        (boardData.bdlist.map(bd => (
                            <tr key={bd.bno}>
                                <td>{bd.bno}</td>
                                <td><a href={`/board/view/${bd.bno}`}>{bd.title}</a></td>
                                <td>{bd.userid}</td>
                                <td>{bd.regdate.substring(0,10)}</td>
                                <td>{bd.thumbs}</td>
                                <td>{bd.views}</td>
                            </tr>
                        ))
                    )
                }
                </tbody>

                <tfoot>
                <tr>
                    <td colSpan="6">
                        <ul className="pagination">
                        { (boardData.cpg > 1) &&
                            (<li className="page-item"><a href={`${pglink}${cpg - 1}`}
                                className="page-link">이전</a></li>) }

                        {
                            (() => {
                                const pgns = [];
                                for (let i = boardData.stblk; i <= boardData.edblk; ++i) {
                                    (
                                        pgns.push(<li key={i} className={(i === boardData.cpg) ? 'page-item active' : 'page-item'}>
                                            <a href={`${pglink}${i}`} className="page-link">{i}</a></li>)
                                    )
                                }
                                return pgns;
                            })()
                        }

                        { (boardData.cpg < boardData.cntpg) &&
                            (<li className="page-item"><a href={`${pglink}${boardData.cpg + 1}`}
                                className="page-link">다음</a></li>) }
                        </ul>
                    </td>
                </tr>
                </tfoot>
            </table>
        </main>
    )
}

export default BoardList;
