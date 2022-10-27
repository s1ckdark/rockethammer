import React from 'react';
import {useNavigate} from 'react-router-dom';

export default {
    krDateTime : (date) => {
        return new Date(new Date(date) - new Date().getTimezoneOffset() * 60000).toISOString().split('.')[0].replace('T', ' ')
    },
    IsJsonString : (str) => {
        try {
            JSON.parse(str);
        } catch (e) {
            return false;
        }
        return true;
    },
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
                    "memo":"메모",
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
                    "메모":"memo",
                    "토픽설명":"topic_desc"
                };
                break;
            default:
                break;
            }
            console.log(data, );
            let str = typeof(data) === 'string' && data != ''  ? JSON.parse(data):data
            const pattern = new RegExp(
                Object.keys(swaps).map(e => `(?:"(${e})":)`).join("|"), "g"
            );
            const result = JSON.stringify(str, null, 4).replace(pattern, m => `"${swaps[m.slice(1,-2)]}":`)
            return result;
    },
    isEmpty : ( str ) => {
        return (str == '' || str == undefined || str == null || str == 'null' );
    },

    isNotEmpty : (str) => {
        return !this.isEmpty(str);
    },
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
            "memo":"메모",
            "topic_desc":"토픽설명"
        }
        return  defineName[name] ? defineName[name]:name;
    },
    required : (value) => {
        if (!value) {
          return (
            <div className="alert alert-danger" role="alert">
              필수정보 입니다
            </div>
          );
        }
    },
    validation : (name, value, min = 0, max = 128) => {
        if (value.length < min || value.length > max) {
          return (
            <div className="alert alert-danger" role="alert">
              {name}은 최소 {min}자에서 {max}자 사이로 입력해주세요.
            </div>
          );
        }
    },
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
    movetolink : (link) => {
        return link === window.location.pathname ? true:false
    },
    updateState : (key, value) => {
        this.setState({
            ...this.state,
            [key]:[value]
        })
    },
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
    parseData : (str) => {
        return JSON.parse(str);
    }
}
