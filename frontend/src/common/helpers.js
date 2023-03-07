import React from 'react';

const helpers = {
    // 시간 관련 function
    // mongodb에서 datetime을 ISOdate로 저장하기 떄문에 사용할떄는 한국 시간으로 변경해줘야한다
    // meta 저장한 때는 한국시간을 저장하기 떄문에 ISOdate만 보기 좋게 변경해줘야 한다
    krDateTime : (date) => {
        return new Date(new Date(date) - new Date().getTimezoneOffset() * 60000).toISOString().split('.')[0].replace('T', ' ')
    },
    // connector에 의해 들어온 topic들의 시간은 mongodb의 ISODate로 들어오기 떄문에 KR time으로 변경해줘야한다
    schemaTime : (date) => {
        var tmp = new Date(date);
        tmp = tmp.setHours(tmp.getHours() + 9);
        return new Date(new Date(tmp) - new Date().getTimezoneOffset() * 60000).toISOString().split('.')[0].replace('T', ' ')
    },
    IsJsonString : (str) => {
        try {
            JSON.parse(str);
        } catch (e) {
            return false;
        }
        return true;
    },
    // json으로 볼떄 json의 key를 한글로 변경
    // translate와 비슷하네?
    replaceKey : (data, mode)=>{
        let swaps;
        switch(mode) {
            case "entokr":
                swaps = {
                    "_id":"_id",
                    "topic_name":"토픽명",
                    "schema_id":"스키마ID",
                    "schema_version":"물리스키마버전",
                    "meta_version":"메타버전",
                    "revision":"논리스키마버전",
                    "recycle_pol":"데이터삭제주기",
                    "op_name":"관리부서",
                    "service":"업무시스템",
                    "related_topics":"연관토픽",
                    "last_mod_dt":"최종수정시간",
                    "last_mod_id":"최종수정자",
                    "schema":"",
                    "p_name":"물리명",
                    "p_type":"데이터 타입",
                    "l_name":"논리명",
                    "l_def":"설명",
                    "is_null":"널 여부",
                    "default":"기본값",
                    "topic_desc":"토픽설명"
                };
                break;
            case "krtoen":
                swaps = {
                    "_id":"_id",
                    "토픽명":"topic_name",
                    "스키마ID":"schema_id",
                    "스키마버전":"schema_version",
                    "메타버전":"meta_version",
                    "데이터삭제주기":"recycle_pol",
                    "관리부서":"op_name",
                    "업무시스템":"service",
                    "연관토픽":"related_topics",
                    "최종수정시간":"last_mod_dt",
                    "최종수정자":"last_mod_id",
                    "schema":"schema",
                    "물리명":"p_name",
                    "데이터 타입":"p_type",
                    "논리명":"l_name",
                    "설명":"l_def",
                    "널 여부":"is_null",
                    "기본값":"default",
                    "토픽설명":"topic_desc"
                };
                break;
            default:
                break;
            }
            const pattern = new RegExp(
                Object.keys(swaps).map(e => `(?:"(${e})":)`).join("|"), "g"
            );
            const result = JSON.stringify(data, null, 8).replace(pattern, m => `"${swaps[m.slice(1,-2)]}":`)
            return result;
    },
        // obj가 빈값인지 아닌지 구분한다
    isEmpty : ( str ) => {
        return (str === '' || str === undefined || str === null || str === 'null' );
    },
    // obj가 빈값인지 아닌지 구분한다
    isNotEmpty : (str) => {
        return !this.isEmpty(str);
    },
    // obj가 empty인지 아닌지 확인
    isEmptyObj : (value) => {
        return value && Object.keys(value).length === 0 && value.constructor === Object;
    },
    // topic의 key를 한글로 번역
    translate : (name) => {
        var defineName = {
            "_id":"_id",
            "topic_name":"토픽명",
            "schema_id":"스키마ID",
            "schema_version":"물리스키마버전",
            "meta_version":"메타버전",
            "revision":"논리스키마버전",
            "recycle_pol":"데이터삭제주기",
            "op_name":"관리부서",
            "service":"업무시스템",
            "related_topics":"연관토픽",
            "last_mod_dt":"최종수정시간",
            "last_mod_id":"최종수정자",
            "schema":"",
            "p_name":"물리명",
            "p_type":"데이터 타입",
            "l_name":"논리명",
            "l_def":"설명",
            "is_null":"널 여부",
            "default":"기본값",
            "topic_desc":"토픽설명",
            "admin":"관리자 모드",
            "weblog":"사용자 로그",
            "manager":"사용자 관리",
            "register":"사용자 등록",
            "meta":"메타관리",
            "list":"목록",
            "write":"등록",
            "view":"조회",
            "history":"이력",
            "retension":"보존기간(일)",
            "pii":"pii",
            "table":"테이블",
            "json":"JSON",
            "changed":"변경이력",
            "update":"수정",
            "reg":"등록",
            "change":"변경 등록",
            "":"홈",
            "userhistory":"사용자 이력"
        }
        return  defineName[name] ? defineName[name]:name;
    },
    // obj depth별 key별 type 파악
    iterateObj : (dupeObj) => {
        var retObj = new Object();
        if (typeof (dupeObj) === 'object') {
            if (typeof (dupeObj.length) == 'number')
                retObj = new Array();
            for (var objInd in dupeObj) {
                if (dupeObj[objInd] === null)
                    dupeObj[objInd] = "Empty";
                if (typeof (dupeObj[objInd]) === 'object') {
                    retObj[objInd] = this.iterateObj(dupeObj[objInd]);
                } else if (typeof (dupeObj[objInd]) === 'string') {
                    retObj[objInd] = dupeObj[objInd];
                } else if (typeof (dupeObj[objInd]) === 'number') {
                    retObj[objInd] = dupeObj[objInd];
                } else if (typeof (dupeObj[objInd]) === 'boolean') {
                    ((dupeObj[objInd] === true) ? retObj[objInd] = true : retObj[objInd] = false);
                }
            }
        }
        return retObj;
    },
    // state 업데이트
    updateState : (key, value) => {
        this.setState({
            ...this.state,
            [key]:[value]
        })
    },
    // nested json을 depth별로 모두 파싱한다
    parseNested : (str) => {
            try {
                return JSON.parse(str, (_, val) => {
                    if (typeof val === 'string')
                        return this.parseNested(val)
                    return val
                })
            } catch (exc) {
                return str
            }
    },
    // javascript의 confirm을 구현
    useConfirm : (e, message, onConfirm, onCancel) => {
        e.preventDefault()
        if(window.confirm(message)) {
            onConfirm();
        } else {
            onCancel();
        }
    },
    // meta에서 버전을 저장하거나 읽어올때 버전 계산을 위해 값의 type을 확인할 때 사용
    isInt : (val) => {
        let tmp = parseInt(val);
        return typeof tmp === "number" && isFinite(tmp) && Math.floor(tmp) === tmp ? "number":"string"
    },
    sortObj : (obj) => {
        Object.keys(obj).sort().reduce(
        (newObj,key) => {
           newObj[key] = obj[key];
           return newObj;
        },
        {}
     )
    }
}

export default helpers;