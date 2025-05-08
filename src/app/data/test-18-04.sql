--
-- PostgreSQL database dump
--

-- Dumped from database version 17.4
-- Dumped by pg_dump version 17.4

-- Started on 2025-04-18 00:22:56

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 5 (class 2615 OID 25658)
-- Name: public; Type: SCHEMA; Schema: -; Owner: postgres
--

-- *not* creating schema, since initdb creates it


ALTER SCHEMA public OWNER TO postgres;

--
-- TOC entry 5009 (class 0 OID 0)
-- Dependencies: 5
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: postgres
--

COMMENT ON SCHEMA public IS '';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 239 (class 1259 OID 25790)
-- Name: Account; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Account" (
    id text NOT NULL,
    "userId" text NOT NULL,
    type text NOT NULL,
    provider text NOT NULL,
    "providerAccountId" text NOT NULL,
    refresh_token text,
    access_token text,
    expires_at integer,
    token_type text,
    scope text,
    id_token text,
    session_state text
);


ALTER TABLE public."Account" OWNER TO postgres;

--
-- TOC entry 230 (class 1259 OID 25734)
-- Name: Comment; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Comment" (
    id bigint NOT NULL,
    content text NOT NULL,
    "userId" text NOT NULL,
    "propertyId" bigint NOT NULL,
    "parentId" bigint,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Comment" OWNER TO postgres;

--
-- TOC entry 234 (class 1259 OID 25754)
-- Name: CommentReply; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."CommentReply" (
    id bigint NOT NULL,
    content text NOT NULL,
    "userId" text NOT NULL,
    "commentId" bigint NOT NULL,
    "propertyId" bigint NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."CommentReply" OWNER TO postgres;

--
-- TOC entry 233 (class 1259 OID 25753)
-- Name: CommentReply_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."CommentReply_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."CommentReply_id_seq" OWNER TO postgres;

--
-- TOC entry 5011 (class 0 OID 0)
-- Dependencies: 233
-- Name: CommentReply_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."CommentReply_id_seq" OWNED BY public."CommentReply".id;


--
-- TOC entry 229 (class 1259 OID 25733)
-- Name: Comment_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Comment_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Comment_id_seq" OWNER TO postgres;

--
-- TOC entry 5012 (class 0 OID 0)
-- Dependencies: 229
-- Name: Comment_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Comment_id_seq" OWNED BY public."Comment".id;


--
-- TOC entry 232 (class 1259 OID 25744)
-- Name: Like; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Like" (
    id bigint NOT NULL,
    "propertyId" bigint NOT NULL,
    "userId" text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."Like" OWNER TO postgres;

--
-- TOC entry 236 (class 1259 OID 25764)
-- Name: LikeComment; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."LikeComment" (
    id bigint NOT NULL,
    "userId" text NOT NULL,
    "commentId" bigint NOT NULL,
    "replyId" bigint,
    "propertyId" bigint,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."LikeComment" OWNER TO postgres;

--
-- TOC entry 235 (class 1259 OID 25763)
-- Name: LikeComment_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."LikeComment_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."LikeComment_id_seq" OWNER TO postgres;

--
-- TOC entry 5013 (class 0 OID 0)
-- Dependencies: 235
-- Name: LikeComment_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."LikeComment_id_seq" OWNED BY public."LikeComment".id;


--
-- TOC entry 231 (class 1259 OID 25743)
-- Name: Like_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Like_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Like_id_seq" OWNER TO postgres;

--
-- TOC entry 5014 (class 0 OID 0)
-- Dependencies: 231
-- Name: Like_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Like_id_seq" OWNED BY public."Like".id;


--
-- TOC entry 222 (class 1259 OID 25691)
-- Name: Property; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Property" (
    id bigint NOT NULL,
    title text NOT NULL,
    description text NOT NULL,
    price double precision NOT NULL,
    address text NOT NULL,
    city text NOT NULL,
    state text,
    zip_code text,
    bedrooms integer NOT NULL,
    bathrooms integer NOT NULL,
    square_feet double precision NOT NULL,
    status text DEFAULT 'active'::text NOT NULL,
    phone text,
    line_id text,
    google_map_link text,
    co_agent_commission double precision,
    co_agent_incentive text,
    co_agent_notes text,
    points integer DEFAULT 0 NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "userId" text NOT NULL
);


ALTER TABLE public."Property" OWNER TO postgres;

--
-- TOC entry 245 (class 1259 OID 28110)
-- Name: PropertyDocument; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."PropertyDocument" (
    id bigint NOT NULL,
    "documentUrl" text NOT NULL,
    title text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "propertyId" bigint NOT NULL
);


ALTER TABLE public."PropertyDocument" OWNER TO postgres;

--
-- TOC entry 244 (class 1259 OID 28109)
-- Name: PropertyDocument_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."PropertyDocument_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."PropertyDocument_id_seq" OWNER TO postgres;

--
-- TOC entry 5015 (class 0 OID 0)
-- Dependencies: 244
-- Name: PropertyDocument_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."PropertyDocument_id_seq" OWNED BY public."PropertyDocument".id;


--
-- TOC entry 224 (class 1259 OID 25703)
-- Name: PropertyImage; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."PropertyImage" (
    id bigint NOT NULL,
    "imageUrl" text NOT NULL,
    "isMain" boolean DEFAULT false NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "propertyId" bigint NOT NULL
);


ALTER TABLE public."PropertyImage" OWNER TO postgres;

--
-- TOC entry 223 (class 1259 OID 25702)
-- Name: PropertyImage_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."PropertyImage_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."PropertyImage_id_seq" OWNER TO postgres;

--
-- TOC entry 5016 (class 0 OID 0)
-- Dependencies: 223
-- Name: PropertyImage_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."PropertyImage_id_seq" OWNED BY public."PropertyImage".id;


--
-- TOC entry 243 (class 1259 OID 28100)
-- Name: PropertyVideo; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."PropertyVideo" (
    id bigint NOT NULL,
    "videoUrl" text NOT NULL,
    title text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "propertyId" bigint NOT NULL
);


ALTER TABLE public."PropertyVideo" OWNER TO postgres;

--
-- TOC entry 242 (class 1259 OID 28099)
-- Name: PropertyVideo_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."PropertyVideo_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."PropertyVideo_id_seq" OWNER TO postgres;

--
-- TOC entry 5017 (class 0 OID 0)
-- Dependencies: 242
-- Name: PropertyVideo_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."PropertyVideo_id_seq" OWNED BY public."PropertyVideo".id;


--
-- TOC entry 228 (class 1259 OID 25724)
-- Name: PropertyVote; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."PropertyVote" (
    id bigint NOT NULL,
    "propertyId" bigint NOT NULL,
    "userId" text NOT NULL,
    "voteType" character varying(4) NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."PropertyVote" OWNER TO postgres;

--
-- TOC entry 227 (class 1259 OID 25723)
-- Name: PropertyVote_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."PropertyVote_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."PropertyVote_id_seq" OWNER TO postgres;

--
-- TOC entry 5018 (class 0 OID 0)
-- Dependencies: 227
-- Name: PropertyVote_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."PropertyVote_id_seq" OWNED BY public."PropertyVote".id;


--
-- TOC entry 221 (class 1259 OID 25690)
-- Name: Property_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Property_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Property_id_seq" OWNER TO postgres;

--
-- TOC entry 5019 (class 0 OID 0)
-- Dependencies: 221
-- Name: Property_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Property_id_seq" OWNED BY public."Property".id;


--
-- TOC entry 240 (class 1259 OID 25797)
-- Name: Session; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Session" (
    id text NOT NULL,
    "sessionToken" text NOT NULL,
    "userId" text NOT NULL,
    expires timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Session" OWNER TO postgres;

--
-- TOC entry 218 (class 1259 OID 25668)
-- Name: User; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."User" (
    id text NOT NULL,
    "firstName" text NOT NULL,
    "lastName" text NOT NULL,
    email text NOT NULL,
    password text NOT NULL,
    "googleId" text,
    "birthDate" timestamp(3) without time zone,
    "showBirthDate" boolean DEFAULT false NOT NULL,
    bio text,
    education text,
    "currentCompany" text,
    "previousCompanies" text,
    "realEstateExperience" text,
    "lineContact" text,
    avatar text,
    "backgroundImage" text,
    "voteCount" integer DEFAULT 0 NOT NULL,
    followers integer DEFAULT 0 NOT NULL,
    "propertiesCount" integer DEFAULT 0 NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    phone text
);


ALTER TABLE public."User" OWNER TO postgres;

--
-- TOC entry 220 (class 1259 OID 25681)
-- Name: UserRole; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."UserRole" (
    id bigint NOT NULL,
    "userId" text NOT NULL,
    role text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."UserRole" OWNER TO postgres;

--
-- TOC entry 219 (class 1259 OID 25680)
-- Name: UserRole_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."UserRole_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."UserRole_id_seq" OWNER TO postgres;

--
-- TOC entry 5020 (class 0 OID 0)
-- Dependencies: 219
-- Name: UserRole_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."UserRole_id_seq" OWNED BY public."UserRole".id;


--
-- TOC entry 241 (class 1259 OID 25804)
-- Name: VerificationToken; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."VerificationToken" (
    identifier text NOT NULL,
    token text NOT NULL,
    expires timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."VerificationToken" OWNER TO postgres;

--
-- TOC entry 226 (class 1259 OID 25714)
-- Name: Vote; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Vote" (
    id bigint NOT NULL,
    "propertyId" bigint NOT NULL,
    "userId" text NOT NULL,
    "voteType" character varying(4) NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."Vote" OWNER TO postgres;

--
-- TOC entry 225 (class 1259 OID 25713)
-- Name: Vote_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Vote_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Vote_id_seq" OWNER TO postgres;

--
-- TOC entry 5021 (class 0 OID 0)
-- Dependencies: 225
-- Name: Vote_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Vote_id_seq" OWNED BY public."Vote".id;


--
-- TOC entry 217 (class 1259 OID 25659)
-- Name: _prisma_migrations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public._prisma_migrations (
    id character varying(36) NOT NULL,
    checksum character varying(64) NOT NULL,
    finished_at timestamp with time zone,
    migration_name character varying(255) NOT NULL,
    logs text,
    rolled_back_at timestamp with time zone,
    started_at timestamp with time zone DEFAULT now() NOT NULL,
    applied_steps_count integer DEFAULT 0 NOT NULL
);


ALTER TABLE public._prisma_migrations OWNER TO postgres;

--
-- TOC entry 237 (class 1259 OID 25773)
-- Name: coin_balances; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.coin_balances (
    id text NOT NULL,
    "userId" text NOT NULL,
    balance double precision DEFAULT 0 NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.coin_balances OWNER TO postgres;

--
-- TOC entry 238 (class 1259 OID 25782)
-- Name: coin_transactions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.coin_transactions (
    id text NOT NULL,
    type text NOT NULL,
    amount double precision NOT NULL,
    description text NOT NULL,
    "propertyId" bigint,
    "userId" text NOT NULL,
    "coinBalanceId" text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.coin_transactions OWNER TO postgres;

--
-- TOC entry 4739 (class 2604 OID 25737)
-- Name: Comment id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Comment" ALTER COLUMN id SET DEFAULT nextval('public."Comment_id_seq"'::regclass);


--
-- TOC entry 4743 (class 2604 OID 25757)
-- Name: CommentReply id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."CommentReply" ALTER COLUMN id SET DEFAULT nextval('public."CommentReply_id_seq"'::regclass);


--
-- TOC entry 4741 (class 2604 OID 25747)
-- Name: Like id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Like" ALTER COLUMN id SET DEFAULT nextval('public."Like_id_seq"'::regclass);


--
-- TOC entry 4745 (class 2604 OID 25767)
-- Name: LikeComment id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."LikeComment" ALTER COLUMN id SET DEFAULT nextval('public."LikeComment_id_seq"'::regclass);


--
-- TOC entry 4728 (class 2604 OID 25694)
-- Name: Property id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Property" ALTER COLUMN id SET DEFAULT nextval('public."Property_id_seq"'::regclass);


--
-- TOC entry 4752 (class 2604 OID 28113)
-- Name: PropertyDocument id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."PropertyDocument" ALTER COLUMN id SET DEFAULT nextval('public."PropertyDocument_id_seq"'::regclass);


--
-- TOC entry 4732 (class 2604 OID 25706)
-- Name: PropertyImage id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."PropertyImage" ALTER COLUMN id SET DEFAULT nextval('public."PropertyImage_id_seq"'::regclass);


--
-- TOC entry 4750 (class 2604 OID 28103)
-- Name: PropertyVideo id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."PropertyVideo" ALTER COLUMN id SET DEFAULT nextval('public."PropertyVideo_id_seq"'::regclass);


--
-- TOC entry 4737 (class 2604 OID 25727)
-- Name: PropertyVote id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."PropertyVote" ALTER COLUMN id SET DEFAULT nextval('public."PropertyVote_id_seq"'::regclass);


--
-- TOC entry 4726 (class 2604 OID 25684)
-- Name: UserRole id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."UserRole" ALTER COLUMN id SET DEFAULT nextval('public."UserRole_id_seq"'::regclass);


--
-- TOC entry 4735 (class 2604 OID 25717)
-- Name: Vote id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Vote" ALTER COLUMN id SET DEFAULT nextval('public."Vote_id_seq"'::regclass);


--
-- TOC entry 4997 (class 0 OID 25790)
-- Dependencies: 239
-- Data for Name: Account; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public."Account" (id, "userId", type, provider, "providerAccountId", refresh_token, access_token, expires_at, token_type, scope, id_token, session_state) VALUES ('cm9frazjg0006ul9kfpcp022e', 'cm9frazii0000ul9ky5smgu2t', 'oauth', 'google', 'google_cm9frazii0000ul9ky5smgu2t', 'mock_refresh_token', 'mock_access_token', 1744559106, 'Bearer', 'email profile', 'mock_id_token', 'mock_session_state');
INSERT INTO public."Account" (id, "userId", type, provider, "providerAccountId", refresh_token, access_token, expires_at, token_type, scope, id_token, session_state) VALUES ('cm9frazk3000ful9ktb16y1li', 'cm9frazjk0009ul9krminujew', 'oauth', 'google', 'google_cm9frazjk0009ul9krminujew', 'mock_refresh_token', 'mock_access_token', 1744559106, 'Bearer', 'email profile', 'mock_id_token', 'mock_session_state');


--
-- TOC entry 4988 (class 0 OID 25734)
-- Dependencies: 230
-- Data for Name: Comment; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public."Comment" (id, content, "userId", "propertyId", "parentId", "createdAt", "updatedAt") VALUES (4, 'ทำเลดีมาก มีสิ่งอำนวยความสะดวกครบครัน!', 'cm9frazii0000ul9ky5smgu2t', 4, NULL, '2025-04-13 14:45:06.016', '2025-04-13 14:45:06.016');
INSERT INTO public."Comment" (id, content, "userId", "propertyId", "parentId", "createdAt", "updatedAt") VALUES (5, 'ทำเลดีมาก มีสิ่งอำนวยความสะดวกครบครัน!', 'cm9frazjk0009ul9krminujew', 5, NULL, '2025-04-13 14:45:06.046', '2025-04-13 14:45:06.046');
INSERT INTO public."Comment" (id, content, "userId", "propertyId", "parentId", "createdAt", "updatedAt") VALUES (6, 'โหวตให้หน่อย', '112218925424134660074', 6, NULL, '2025-04-13 21:36:34.925', '2025-04-13 21:36:34.925');
INSERT INTO public."Comment" (id, content, "userId", "propertyId", "parentId", "createdAt", "updatedAt") VALUES (7, 'hi', '112218925424134660074', 10, NULL, '2025-04-15 13:24:44.929', '2025-04-15 13:24:44.929');
INSERT INTO public."Comment" (id, content, "userId", "propertyId", "parentId", "createdAt", "updatedAt") VALUES (8, 'กดไลค์เยอะๆนะครับ', '112218925424134660074', 10, NULL, '2025-04-15 16:04:07.759', '2025-04-15 16:04:07.759');


--
-- TOC entry 4992 (class 0 OID 25754)
-- Dependencies: 234
-- Data for Name: CommentReply; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public."CommentReply" (id, content, "userId", "commentId", "propertyId", "createdAt", "updatedAt") VALUES (4, 'ขอบคุณสำหรับความคิดเห็นครับ', 'cm9frazii0000ul9ky5smgu2t', 4, 4, '2025-04-13 14:45:06.022', '2025-04-13 14:45:06.022');
INSERT INTO public."CommentReply" (id, content, "userId", "commentId", "propertyId", "createdAt", "updatedAt") VALUES (5, 'ขอบคุณสำหรับความคิดเห็นครับ', 'cm9frazjk0009ul9krminujew', 5, 5, '2025-04-13 14:45:06.049', '2025-04-13 14:45:06.049');
INSERT INTO public."CommentReply" (id, content, "userId", "commentId", "propertyId", "createdAt", "updatedAt") VALUES (6, 'จริงด้วยครับ
', '112218925424134660074', 5, 5, '2025-04-13 21:25:21.483', '2025-04-13 21:25:21.483');
INSERT INTO public."CommentReply" (id, content, "userId", "commentId", "propertyId", "createdAt", "updatedAt") VALUES (7, 'hi too', '112218925424134660074', 7, 10, '2025-04-15 14:28:09.07', '2025-04-15 14:28:09.07');
INSERT INTO public."CommentReply" (id, content, "userId", "commentId", "propertyId", "createdAt", "updatedAt") VALUES (8, 'hi too', '112218925424134660074', 7, 10, '2025-04-15 14:47:01.089', '2025-04-15 14:47:01.089');


--
-- TOC entry 4990 (class 0 OID 25744)
-- Dependencies: 232
-- Data for Name: Like; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public."Like" (id, "propertyId", "userId", "createdAt") VALUES (3, 4, 'cm9frazii0000ul9ky5smgu2t', '2025-04-13 14:45:06.005');
INSERT INTO public."Like" (id, "propertyId", "userId", "createdAt") VALUES (4, 5, 'cm9frazjk0009ul9krminujew', '2025-04-13 14:45:06.041');
INSERT INTO public."Like" (id, "propertyId", "userId", "createdAt") VALUES (5, 5, '112218925424134660074', '2025-04-13 21:25:31.917');
INSERT INTO public."Like" (id, "propertyId", "userId", "createdAt") VALUES (6, 6, '112218925424134660074', '2025-04-13 21:54:13.07');


--
-- TOC entry 4994 (class 0 OID 25764)
-- Dependencies: 236
-- Data for Name: LikeComment; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public."LikeComment" (id, "userId", "commentId", "replyId", "propertyId", "createdAt") VALUES (4, 'cm9frazii0000ul9ky5smgu2t', 4, NULL, NULL, '2025-04-13 14:45:06.016');
INSERT INTO public."LikeComment" (id, "userId", "commentId", "replyId", "propertyId", "createdAt") VALUES (5, 'cm9frazjk0009ul9krminujew', 5, NULL, NULL, '2025-04-13 14:45:06.046');
INSERT INTO public."LikeComment" (id, "userId", "commentId", "replyId", "propertyId", "createdAt") VALUES (14, '112218925424134660074', 7, 8, 10, '2025-04-15 15:52:30.487');
INSERT INTO public."LikeComment" (id, "userId", "commentId", "replyId", "propertyId", "createdAt") VALUES (17, '112218925424134660074', 5, NULL, 5, '2025-04-16 00:52:45.281');
INSERT INTO public."LikeComment" (id, "userId", "commentId", "replyId", "propertyId", "createdAt") VALUES (19, 'cm9llc0y20001ulp0ox45txgm', 8, NULL, 10, '2025-04-17 17:22:16.409');


--
-- TOC entry 4980 (class 0 OID 25691)
-- Dependencies: 222
-- Data for Name: Property; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public."Property" (id, title, description, price, address, city, state, zip_code, bedrooms, bathrooms, square_feet, status, phone, line_id, google_map_link, co_agent_commission, co_agent_incentive, co_agent_notes, points, "createdAt", "updatedAt", "userId") VALUES (4, 'คอนโดหรูสุขุมวิท', 'คอนโด 2 ห้องนอนวิวเมือง', 15000000, '123 ถนนสุขุมวิท', 'กรุงเทพฯ', 'กรุงเทพฯ', '10110', 2, 2, 80, 'active', '0812345678', 'luxurycondo', 'https://goo.gl/maps/example', 2.5, 'ฟรีค่าบริการจัดการทรัพย์สิน 1 ปี', 'ย่านที่มีความต้องการสูง', 100, '2025-04-13 14:45:06.005', '2025-04-13 14:45:06.005', 'cm9frazii0000ul9ky5smgu2t');
INSERT INTO public."Property" (id, title, description, price, address, city, state, zip_code, bedrooms, bathrooms, square_feet, status, phone, line_id, google_map_link, co_agent_commission, co_agent_incentive, co_agent_notes, points, "createdAt", "updatedAt", "userId") VALUES (5, 'คอนโดหรูสุขุมวิท', 'คอนโด 2 ห้องนอนวิวเมือง', 15000000, '123 ถนนสุขุมวิท', 'กรุงเทพฯ', 'กรุงเทพฯ', '10110', 2, 2, 80, 'active', '0812345678', 'luxurycondo', 'https://goo.gl/maps/example', 2.5, 'ฟรีค่าบริการจัดการทรัพย์สิน 1 ปี', 'ย่านที่มีความต้องการสูง', 100, '2025-04-13 14:45:06.041', '2025-04-13 14:45:06.041', 'cm9frazjk0009ul9krminujew');
INSERT INTO public."Property" (id, title, description, price, address, city, state, zip_code, bedrooms, bathrooms, square_feet, status, phone, line_id, google_map_link, co_agent_commission, co_agent_incentive, co_agent_notes, points, "createdAt", "updatedAt", "userId") VALUES (10, 'บ้านสไตล์โมเดิร์น พร้อมเฉลียงสำหรับนั่งเล่น', 'test reward2', 16000000, '82 moo7 chalong', 'Phuket town', NULL, NULL, 1, 1, 149, 'active', '0969894441', 'https://line.me/ti/p/MclMbZ6YTC', 'https://goo.gl/maps/7hsWgY7qnpBYfZRv7?g_st=ac', 10, '0810810049', NULL, 105, '2025-04-15 12:35:17.89', '2025-04-15 15:54:00.579', '112218925424134660074');
INSERT INTO public."Property" (id, title, description, price, address, city, state, zip_code, bedrooms, bathrooms, square_feet, status, phone, line_id, google_map_link, co_agent_commission, co_agent_incentive, co_agent_notes, points, "createdAt", "updatedAt", "userId") VALUES (6, 'บ้านสวย', 'บ้านสวยมาก', 250000000, '82 moo7 chalong', 'Phuket town', NULL, NULL, 1, 1, 450, 'active', '0969894441', 'https://line.me/ti/p/MclMbZ6YTC', 'https://goo.gl/maps/7hsWgY7qnpBYfZRv7?g_st=ac', 10, NULL, NULL, 0, '2025-04-13 21:35:23.636', '2025-04-15 06:18:31.301', '112218925424134660074');
INSERT INTO public."Property" (id, title, description, price, address, city, state, zip_code, bedrooms, bathrooms, square_feet, status, phone, line_id, google_map_link, co_agent_commission, co_agent_incentive, co_agent_notes, points, "createdAt", "updatedAt", "userId") VALUES (7, 'บ้านสไตล์โมเดิร์น พร้อมเฉลียงสำหรับนั่งเล่น', 'บ้านสไตล์โมเดิร์น พร้อมเฉลียงสำหรับนั่งเล่น', 16000000, '82 moo7 chalong', 'Phuket town', NULL, NULL, 1, 1, 149, 'active', '0810810049', 'https://line.me/ti/p/MclMbZ6YTC', 'https://goo.gl/maps/7hsWgY7qnpBYfZRv7?g_st=ac', 10, '0810810049', NULL, 0, '2025-04-15 08:26:43.464', '2025-04-15 08:26:43.464', '112218925424134660074');
INSERT INTO public."Property" (id, title, description, price, address, city, state, zip_code, bedrooms, bathrooms, square_feet, status, phone, line_id, google_map_link, co_agent_commission, co_agent_incentive, co_agent_notes, points, "createdAt", "updatedAt", "userId") VALUES (8, 'บ้านสไตล์โมเดิร์น พร้อมเฉลียงสำหรับนั่งเล่น', 'บ้านสไตล์โมเดิร์น พร้อมเฉลียงสำหรับนั่งเล่น', 16000000, '82 moo7 chalong', 'Phuket town', NULL, NULL, 1, 1, 149, 'active', '0810810049', 'https://line.me/ti/p/MclMbZ6YTC', 'https://goo.gl/maps/7hsWgY7qnpBYfZRv7?g_st=ac', 10, '0810810049', NULL, 0, '2025-04-15 09:09:00.452', '2025-04-15 09:09:00.452', '112218925424134660074');
INSERT INTO public."Property" (id, title, description, price, address, city, state, zip_code, bedrooms, bathrooms, square_feet, status, phone, line_id, google_map_link, co_agent_commission, co_agent_incentive, co_agent_notes, points, "createdAt", "updatedAt", "userId") VALUES (9, 'บ้านสไตล์โมเดิร์น พร้อมเฉลียงสำหรับนั่งเล่น', 'test reward', 16000000, '82 moo7 chalong', 'Phuket town', NULL, NULL, 1, 1, 149, 'active', '0969894441', 'https://line.me/ti/p/MclMbZ6YTC', 'https://goo.gl/maps/7hsWgY7qnpBYfZRv7?g_st=ac', 10, '0810810049', NULL, 100, '2025-04-15 12:33:19.936', '2025-04-16 02:03:02.725', '112218925424134660074');


--
-- TOC entry 5003 (class 0 OID 28110)
-- Dependencies: 245
-- Data for Name: PropertyDocument; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public."PropertyDocument" (id, "documentUrl", title, "createdAt", "updatedAt", "propertyId") VALUES (1, 'https://res.cloudinary.com/ddvuxyayd/raw/upload/v1744708140/real-estate/documents/rqmit2uxs2ziuwyjhxxp', '2020-10_efb2aa6a9c31528.pdf', '2025-04-15 09:09:00.452', '2025-04-15 09:09:00.452', 8);


--
-- TOC entry 4982 (class 0 OID 25703)
-- Dependencies: 224
-- Data for Name: PropertyImage; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public."PropertyImage" (id, "imageUrl", "isMain", "createdAt", "updatedAt", "propertyId") VALUES (7, 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?q=80&w=1000&auto=format&fit=crop', true, '2025-04-13 14:45:06.005', '2025-04-13 14:45:06.005', 4);
INSERT INTO public."PropertyImage" (id, "imageUrl", "isMain", "createdAt", "updatedAt", "propertyId") VALUES (8, 'https://images.unsplash.com/photo-1564013799919-ab600027ffc7?q=80&w=1000&auto=format&fit=crop', false, '2025-04-13 14:45:06.005', '2025-04-13 14:45:06.005', 4);
INSERT INTO public."PropertyImage" (id, "imageUrl", "isMain", "createdAt", "updatedAt", "propertyId") VALUES (9, 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?q=80&w=1000&auto=format&fit=crop', true, '2025-04-13 14:45:06.041', '2025-04-13 14:45:06.041', 5);
INSERT INTO public."PropertyImage" (id, "imageUrl", "isMain", "createdAt", "updatedAt", "propertyId") VALUES (10, 'https://images.unsplash.com/photo-1564013799919-ab600027ffc7?q=80&w=1000&auto=format&fit=crop', false, '2025-04-13 14:45:06.041', '2025-04-13 14:45:06.041', 5);
INSERT INTO public."PropertyImage" (id, "imageUrl", "isMain", "createdAt", "updatedAt", "propertyId") VALUES (11, 'https://res.cloudinary.com/ddvuxyayd/image/upload/v1744580120/real-estate/ajfbizlps8lnk5kkx4vt.jpg', false, '2025-04-13 21:35:23.636', '2025-04-13 21:35:23.636', 6);
INSERT INTO public."PropertyImage" (id, "imageUrl", "isMain", "createdAt", "updatedAt", "propertyId") VALUES (12, 'https://res.cloudinary.com/ddvuxyayd/image/upload/v1744580121/real-estate/wawk1ufc9byf0ironptl.jpg', false, '2025-04-13 21:35:23.636', '2025-04-13 21:35:23.636', 6);
INSERT INTO public."PropertyImage" (id, "imageUrl", "isMain", "createdAt", "updatedAt", "propertyId") VALUES (13, 'https://res.cloudinary.com/ddvuxyayd/image/upload/v1744580122/real-estate/x1pcz7pwsvz3hb1ynhuu.jpg', false, '2025-04-13 21:35:23.636', '2025-04-13 21:35:23.636', 6);
INSERT INTO public."PropertyImage" (id, "imageUrl", "isMain", "createdAt", "updatedAt", "propertyId") VALUES (14, 'https://res.cloudinary.com/ddvuxyayd/image/upload/v1744705599/real-estate/zcp5gj8kjzvdwaih9wbo.webp', false, '2025-04-15 08:26:43.464', '2025-04-15 08:26:43.464', 7);
INSERT INTO public."PropertyImage" (id, "imageUrl", "isMain", "createdAt", "updatedAt", "propertyId") VALUES (15, 'https://res.cloudinary.com/ddvuxyayd/image/upload/v1744705600/real-estate/moxehswleyp2lteuonsf.jpg', false, '2025-04-15 08:26:43.464', '2025-04-15 08:26:43.464', 7);
INSERT INTO public."PropertyImage" (id, "imageUrl", "isMain", "createdAt", "updatedAt", "propertyId") VALUES (16, 'https://res.cloudinary.com/ddvuxyayd/image/upload/v1744705602/real-estate/s892dthfa6ybdpva8xjv.jpg', false, '2025-04-15 08:26:43.464', '2025-04-15 08:26:43.464', 7);
INSERT INTO public."PropertyImage" (id, "imageUrl", "isMain", "createdAt", "updatedAt", "propertyId") VALUES (17, 'https://res.cloudinary.com/ddvuxyayd/image/upload/v1744705603/real-estate/k3aatftilugqwwintdks.jpg', false, '2025-04-15 08:26:43.464', '2025-04-15 08:26:43.464', 7);
INSERT INTO public."PropertyImage" (id, "imageUrl", "isMain", "createdAt", "updatedAt", "propertyId") VALUES (18, 'https://res.cloudinary.com/ddvuxyayd/image/upload/v1744708135/real-estate/paiuupmimlkkf7peqfqn.jpg', false, '2025-04-15 09:09:00.452', '2025-04-15 09:09:00.452', 8);
INSERT INTO public."PropertyImage" (id, "imageUrl", "isMain", "createdAt", "updatedAt", "propertyId") VALUES (19, 'https://res.cloudinary.com/ddvuxyayd/image/upload/v1744708136/real-estate/xmpho1zayzv07vdahih5.jpg', false, '2025-04-15 09:09:00.452', '2025-04-15 09:09:00.452', 8);
INSERT INTO public."PropertyImage" (id, "imageUrl", "isMain", "createdAt", "updatedAt", "propertyId") VALUES (20, 'https://res.cloudinary.com/ddvuxyayd/image/upload/v1744708137/real-estate/fhjgohd25sjvgqb23pju.jpg', false, '2025-04-15 09:09:00.452', '2025-04-15 09:09:00.452', 8);
INSERT INTO public."PropertyImage" (id, "imageUrl", "isMain", "createdAt", "updatedAt", "propertyId") VALUES (21, 'https://res.cloudinary.com/ddvuxyayd/image/upload/v1744720399/real-estate/erzjlteyoidlpxu5elk1.webp', false, '2025-04-15 12:33:19.936', '2025-04-15 12:33:19.936', 9);
INSERT INTO public."PropertyImage" (id, "imageUrl", "isMain", "createdAt", "updatedAt", "propertyId") VALUES (22, 'https://res.cloudinary.com/ddvuxyayd/image/upload/v1744720517/real-estate/yqfiqb7n5rnodauiwwyu.jpg', false, '2025-04-15 12:35:17.89', '2025-04-15 12:35:17.89', 10);


--
-- TOC entry 5001 (class 0 OID 28100)
-- Dependencies: 243
-- Data for Name: PropertyVideo; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public."PropertyVideo" (id, "videoUrl", title, "createdAt", "updatedAt", "propertyId") VALUES (1, 'https://res.cloudinary.com/ddvuxyayd/video/upload/v1744708139/real-estate/videos/hj32cyygadrluelhi1n6.mp4', '1d610336-587d-4b40-9833-a5f7549f0b5a.mp4', '2025-04-15 09:09:00.452', '2025-04-15 09:09:00.452', 8);


--
-- TOC entry 4986 (class 0 OID 25724)
-- Dependencies: 228
-- Data for Name: PropertyVote; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public."PropertyVote" (id, "propertyId", "userId", "voteType", "createdAt") VALUES (4, 4, 'cm9frazii0000ul9ky5smgu2t', 'up', '2025-04-13 14:45:06.005');
INSERT INTO public."PropertyVote" (id, "propertyId", "userId", "voteType", "createdAt") VALUES (5, 5, 'cm9frazjk0009ul9krminujew', 'up', '2025-04-13 14:45:06.041');
INSERT INTO public."PropertyVote" (id, "propertyId", "userId", "voteType", "createdAt") VALUES (6, 10, '112218925424134660074', 'vote', '2025-04-15 15:54:00.574');
INSERT INTO public."PropertyVote" (id, "propertyId", "userId", "voteType", "createdAt") VALUES (7, 9, '112218925424134660074', 'vote', '2025-04-16 02:03:02.693');


--
-- TOC entry 4998 (class 0 OID 25797)
-- Dependencies: 240
-- Data for Name: Session; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public."Session" (id, "sessionToken", "userId", expires) VALUES ('cm9frazji0008ul9k3wlek78j', 'mock_session_token_cm9frazii0000ul9ky5smgu2t', 'cm9frazii0000ul9ky5smgu2t', '2025-04-20 14:45:06.029');
INSERT INTO public."Session" (id, "sessionToken", "userId", expires) VALUES ('cm9frazk4000hul9kveupd1mw', 'mock_session_token_cm9frazjk0009ul9krminujew', 'cm9frazjk0009ul9krminujew', '2025-04-20 14:45:06.052');


--
-- TOC entry 4976 (class 0 OID 25668)
-- Dependencies: 218
-- Data for Name: User; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public."User" (id, "firstName", "lastName", email, password, "googleId", "birthDate", "showBirthDate", bio, education, "currentCompany", "previousCompanies", "realEstateExperience", "lineContact", avatar, "backgroundImage", "voteCount", followers, "propertiesCount", "createdAt", "updatedAt", phone) VALUES ('cm9frazii0000ul9ky5smgu2t', 'สมชาย', 'ใจดี', 'somchai@example.com', '$2b$10$K7L1OJ45/4Y2nIvhRVpCe.FSmhDdWoXehVzJptJ/op0lSsvqNu.Vm', NULL, '1990-01-01 00:00:00', true, 'นายหน้าอสังหาริมทรัพย์มืออาชีพ', 'ปริญญาตรี บริหารธุรกิจ มหาวิทยาลัยธรรมศาสตร์', 'ABC Real Estate', 'XYZ Properties, DEF Realty', 'เชี่ยวชาญด้านอสังหาริมทรัพย์หรูและเชิงพาณิชย์', 'https://line.me/ti/p/~somchai', 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=1000&auto=format&fit=crop', 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=1000&auto=format&fit=crop', 150, 200, 25, '2025-04-13 14:45:05.995', '2025-04-13 14:45:05.995', NULL);
INSERT INTO public."User" (id, "firstName", "lastName", email, password, "googleId", "birthDate", "showBirthDate", bio, education, "currentCompany", "previousCompanies", "realEstateExperience", "lineContact", avatar, "backgroundImage", "voteCount", followers, "propertiesCount", "createdAt", "updatedAt", phone) VALUES ('cm9frazjk0009ul9krminujew', 'สมหญิง', 'ใจงาม', 'somying@example.com', '$2b$10$K7L1OJ45/4Y2nIvhRVpCe.FSmhDdWoXehVzJptJ/op0lSsvqNu.Vm', NULL, '1985-05-15 00:00:00', false, 'เจ้าของและนักลงทุนอสังหาริมทรัพย์', 'ปริญญาโท อสังหาริมทรัพย์ มหาวิทยาลัยธรรมศาสตร์', 'Somying Properties', 'GHI Investments', 'ประสบการณ์ลงทุนอสังหาริมทรัพย์ 15 ปี', 'https://line.me/ti/p/~somying', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1000&auto=format&fit=crop', 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=1000&auto=format&fit=crop', 200, 300, 15, '2025-04-13 14:45:06.033', '2025-04-13 14:45:06.033', NULL);
INSERT INTO public."User" (id, "firstName", "lastName", email, password, "googleId", "birthDate", "showBirthDate", bio, education, "currentCompany", "previousCompanies", "realEstateExperience", "lineContact", avatar, "backgroundImage", "voteCount", followers, "propertiesCount", "createdAt", "updatedAt", phone) VALUES ('112218925424134660074', 'อภิชาติ', 'แซ่หลู่', 'apc9041@gmail.com', '', '112218925424134660074', NULL, false, 'love estate', 'PSU', 'N/A', 'Greazz', 'Construction', 'https://line.me/ti/p/MclMbZ6YTC', 'https://lh3.googleusercontent.com/a/ACg8ocL090efabzsJ9ysr1lmIhE-p2yG8VQgjRHPZ-zyQWvNQYbU92Q=s96-c', 'https://res.cloudinary.com/ddvuxyayd/image/upload/v1744717331/real-estate/profiles/backgrounds/m5odfjb4ojzqrdflmmsn.webp', 0, 0, 0, '2025-04-13 15:51:22.434', '2025-04-15 11:43:07.086', '0969894441');
INSERT INTO public."User" (id, "firstName", "lastName", email, password, "googleId", "birthDate", "showBirthDate", bio, education, "currentCompany", "previousCompanies", "realEstateExperience", "lineContact", avatar, "backgroundImage", "voteCount", followers, "propertiesCount", "createdAt", "updatedAt", phone) VALUES ('cm9likp3d0000ulp0r7twhlg7', 'moji', 'house', 'moji@gmail.com', '$2b$12$f8HOQsE/Aud5YXO2wra/8eL6iwWuSAI38JymKromLu9lx9tZEcc/C', NULL, NULL, false, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, 0, '2025-04-17 15:27:19.522', '2025-04-17 15:27:19.522', '0810810049');
INSERT INTO public."User" (id, "firstName", "lastName", email, password, "googleId", "birthDate", "showBirthDate", bio, education, "currentCompany", "previousCompanies", "realEstateExperience", "lineContact", avatar, "backgroundImage", "voteCount", followers, "propertiesCount", "createdAt", "updatedAt", phone) VALUES ('cm9llc0y20001ulp0ox45txgm', 'meji', 'house', 'meji@gmail.com', '$2b$12$n/2EKQ4hNy0HlIfJnmWibOdw/QhHl/0/UI6mlk27/kDnnjgmFB.Na', NULL, NULL, false, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, 0, '2025-04-17 16:44:33.818', '2025-04-17 16:44:33.818', '0969894441');


--
-- TOC entry 4978 (class 0 OID 25681)
-- Dependencies: 220
-- Data for Name: UserRole; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public."UserRole" (id, "userId", role, "createdAt") VALUES (6, 'cm9frazii0000ul9ky5smgu2t', 'Agent', '2025-04-13 14:45:05.995');
INSERT INTO public."UserRole" (id, "userId", role, "createdAt") VALUES (7, 'cm9frazii0000ul9ky5smgu2t', 'Owner', '2025-04-13 14:45:05.995');
INSERT INTO public."UserRole" (id, "userId", role, "createdAt") VALUES (8, 'cm9frazjk0009ul9krminujew', 'Owner', '2025-04-13 14:45:06.033');


--
-- TOC entry 4999 (class 0 OID 25804)
-- Dependencies: 241
-- Data for Name: VerificationToken; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public."VerificationToken" (identifier, token, expires) VALUES ('somchai@example.com', 'mock_verification_token', '2025-04-14 14:45:06.053');


--
-- TOC entry 4984 (class 0 OID 25714)
-- Dependencies: 226
-- Data for Name: Vote; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public."Vote" (id, "propertyId", "userId", "voteType", "createdAt") VALUES (4, 4, 'cm9frazii0000ul9ky5smgu2t', 'up', '2025-04-13 14:45:06.005');
INSERT INTO public."Vote" (id, "propertyId", "userId", "voteType", "createdAt") VALUES (5, 5, 'cm9frazjk0009ul9krminujew', 'up', '2025-04-13 14:45:06.041');


--
-- TOC entry 4975 (class 0 OID 25659)
-- Dependencies: 217
-- Data for Name: _prisma_migrations; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public._prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) VALUES ('85d8f88a-9222-49d7-921f-1895cc9125f5', 'cb2502bb2860a408b2091ac17b2a41bf2369402fe3e12c0e27c9afd07d115066', '2025-04-13 21:41:13.350801+07', '20250402065219_init', NULL, NULL, '2025-04-13 21:41:13.23953+07', 1);
INSERT INTO public._prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) VALUES ('33a997e5-d854-48e7-88e2-2659dc1f1b5f', '00830cc335f01ca1693d78c22194c24f58d662c3f4afb023a55933fd31c49eb7', '2025-04-13 21:41:13.356486+07', '20250413143517_ralation_repair', NULL, NULL, '2025-04-13 21:41:13.351674+07', 1);


--
-- TOC entry 4995 (class 0 OID 25773)
-- Dependencies: 237
-- Data for Name: coin_balances; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.coin_balances (id, "userId", balance, "createdAt", "updatedAt") VALUES ('cm9frazip0002ul9kwmn7e6zz', 'cm9frazii0000ul9ky5smgu2t', 1000, '2025-04-13 14:45:06.001', '2025-04-13 14:45:06.001');
INSERT INTO public.coin_balances (id, "userId", balance, "createdAt", "updatedAt") VALUES ('cm9frazjq000bul9k95ixplrg', 'cm9frazjk0009ul9krminujew', 1000, '2025-04-13 14:45:06.038', '2025-04-13 14:45:06.038');
INSERT INTO public.coin_balances (id, "userId", balance, "createdAt", "updatedAt") VALUES ('cm9g5ywv60001ul5o5t0hde2c', '112218925424134660074', 8833, '2025-04-13 21:35:36.864', '2025-04-16 02:02:57.202');


--
-- TOC entry 4996 (class 0 OID 25782)
-- Dependencies: 238
-- Data for Name: coin_transactions; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.coin_transactions (id, type, amount, description, "propertyId", "userId", "coinBalanceId", "createdAt") VALUES ('cm9frazjd0004ul9knhlc3sqr', 'reward', 100, 'รางวัลการลงประกาศทรัพย์สิน', 4, 'cm9frazii0000ul9ky5smgu2t', 'cm9frazip0002ul9kwmn7e6zz', '2025-04-13 14:45:06.025');
INSERT INTO public.coin_transactions (id, type, amount, description, "propertyId", "userId", "coinBalanceId", "createdAt") VALUES ('cm9frazk2000dul9kwsfq2r5u', 'reward', 100, 'รางวัลการลงประกาศทรัพย์สิน', 5, 'cm9frazjk0009ul9krminujew', 'cm9frazjq000bul9k95ixplrg', '2025-04-13 14:45:06.05');
INSERT INTO public.coin_transactions (id, type, amount, description, "propertyId", "userId", "coinBalanceId", "createdAt") VALUES ('cm9ihupjs0005ulmg0ir8kys3', 'vote', -1, 'โหวตให้ประกาศ 10', 10, '112218925424134660074', 'cm9g5ywv60001ul5o5t0hde2c', '2025-04-15 12:43:47.819');
INSERT INTO public.coin_transactions (id, type, amount, description, "propertyId", "userId", "coinBalanceId", "createdAt") VALUES ('cm9ihvopi0007ulmgj9awd43y', 'vote', -1000, 'โหวตให้ประกาศ 10', 10, '112218925424134660074', 'cm9g5ywv60001ul5o5t0hde2c', '2025-04-15 12:44:34.134');
INSERT INTO public.coin_transactions (id, type, amount, description, "propertyId", "userId", "coinBalanceId", "createdAt") VALUES ('cm9iihl470009ulmghwvawaqk', 'vote', -2, 'โหวตให้ประกาศ 10', 10, '112218925424134660074', 'cm9g5ywv60001ul5o5t0hde2c', '2025-04-15 13:01:35.912');
INSERT INTO public.coin_transactions (id, type, amount, description, "propertyId", "userId", "coinBalanceId", "createdAt") VALUES ('cm9iins0w000bulmg2jp7jtot', 'vote', -5, 'โหวตให้ประกาศ 10', 10, '112218925424134660074', 'cm9g5ywv60001ul5o5t0hde2c', '2025-04-15 13:06:24.801');
INSERT INTO public.coin_transactions (id, type, amount, description, "propertyId", "userId", "coinBalanceId", "createdAt") VALUES ('cm9iirbi1000dulmg7j2jzdgs', 'vote', -1, 'โหวตให้ประกาศ 10', 10, '112218925424134660074', 'cm9g5ywv60001ul5o5t0hde2c', '2025-04-15 13:09:10.01');
INSERT INTO public.coin_transactions (id, type, amount, description, "propertyId", "userId", "coinBalanceId", "createdAt") VALUES ('cm9iish06000fulmg1pw2ajby', 'vote', -1, 'โหวตให้ประกาศ 10', 10, '112218925424134660074', 'cm9g5ywv60001ul5o5t0hde2c', '2025-04-15 13:10:03.798');
INSERT INTO public.coin_transactions (id, type, amount, description, "propertyId", "userId", "coinBalanceId", "createdAt") VALUES ('cm9iiu4kd000hulmgon5i1nv7', 'vote', -1, 'โหวตให้ประกาศ 10', 10, '112218925424134660074', 'cm9g5ywv60001ul5o5t0hde2c', '2025-04-15 13:11:20.989');
INSERT INTO public.coin_transactions (id, type, amount, description, "propertyId", "userId", "coinBalanceId", "createdAt") VALUES ('cm9ij15d2000julmgooqx7jzl', 'vote', -1, 'โหวตให้ประกาศ 10', 10, '112218925424134660074', 'cm9g5ywv60001ul5o5t0hde2c', '2025-04-15 13:16:48.614');
INSERT INTO public.coin_transactions (id, type, amount, description, "propertyId", "userId", "coinBalanceId", "createdAt") VALUES ('cm9ij52zq000lulmg5ec4qnsp', 'vote', -1, 'โหวตให้ประกาศ 10', 10, '112218925424134660074', 'cm9g5ywv60001ul5o5t0hde2c', '2025-04-15 13:19:52.166');
INSERT INTO public.coin_transactions (id, type, amount, description, "propertyId", "userId", "coinBalanceId", "createdAt") VALUES ('cm9ij9de6000nulmgdo7wmi4k', 'vote', -50, 'โหวตให้ประกาศ 10', 10, '112218925424134660074', 'cm9g5ywv60001ul5o5t0hde2c', '2025-04-15 13:23:12.27');
INSERT INTO public.coin_transactions (id, type, amount, description, "propertyId", "userId", "coinBalanceId", "createdAt") VALUES ('cm9ik3evc0001ul1kczu4o4y0', 'vote', -1, 'โหวตให้ประกาศ', 10, '112218925424134660074', 'cm9g5ywv60001ul5o5t0hde2c', '2025-04-15 13:46:33.764');
INSERT INTO public.coin_transactions (id, type, amount, description, "propertyId", "userId", "coinBalanceId", "createdAt") VALUES ('cm9ihh9x20001ulmgrwar017d', 'reward', 5000, 'ลงประกาศขาย', 9, '112218925424134660074', 'cm9g5ywv60001ul5o5t0hde2c', '2025-04-15 12:33:21.773');
INSERT INTO public.coin_transactions (id, type, amount, description, "propertyId", "userId", "coinBalanceId", "createdAt") VALUES ('cm9ihjsuy0003ulmgyijmb73i', 'reward', 5000, 'ลงประกาศขาย', 10, '112218925424134660074', 'cm9g5ywv60001ul5o5t0hde2c', '2025-04-15 12:35:19.642');
INSERT INTO public.coin_transactions (id, type, amount, description, "propertyId", "userId", "coinBalanceId", "createdAt") VALUES ('cm9iomcns0001ulnksf0f3p1q', 'vote', -1, 'โหวตให้ประกาศ', 10, '112218925424134660074', 'cm9g5ywv60001ul5o5t0hde2c', '2025-04-15 15:53:15.919');
INSERT INTO public.coin_transactions (id, type, amount, description, "propertyId", "userId", "coinBalanceId", "createdAt") VALUES ('cm9ion8590003ulnke6rw228h', 'vote', -2, 'โหวตให้ประกาศ', 10, '112218925424134660074', 'cm9g5ywv60001ul5o5t0hde2c', '2025-04-15 15:53:56.733');
INSERT INTO public.coin_transactions (id, type, amount, description, "propertyId", "userId", "coinBalanceId", "createdAt") VALUES ('cm9jaef650001ulawuxvge17m', 'vote', -100, 'โหวตให้ประกาศ', 9, '112218925424134660074', 'cm9g5ywv60001ul5o5t0hde2c', '2025-04-16 02:02:57.427');


--
-- TOC entry 5022 (class 0 OID 0)
-- Dependencies: 233
-- Name: CommentReply_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."CommentReply_id_seq"', 8, true);


--
-- TOC entry 5023 (class 0 OID 0)
-- Dependencies: 229
-- Name: Comment_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Comment_id_seq"', 8, true);


--
-- TOC entry 5024 (class 0 OID 0)
-- Dependencies: 235
-- Name: LikeComment_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."LikeComment_id_seq"', 19, true);


--
-- TOC entry 5025 (class 0 OID 0)
-- Dependencies: 231
-- Name: Like_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Like_id_seq"', 8, true);


--
-- TOC entry 5026 (class 0 OID 0)
-- Dependencies: 244
-- Name: PropertyDocument_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."PropertyDocument_id_seq"', 1, true);


--
-- TOC entry 5027 (class 0 OID 0)
-- Dependencies: 223
-- Name: PropertyImage_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."PropertyImage_id_seq"', 22, true);


--
-- TOC entry 5028 (class 0 OID 0)
-- Dependencies: 242
-- Name: PropertyVideo_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."PropertyVideo_id_seq"', 1, true);


--
-- TOC entry 5029 (class 0 OID 0)
-- Dependencies: 227
-- Name: PropertyVote_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."PropertyVote_id_seq"', 7, true);


--
-- TOC entry 5030 (class 0 OID 0)
-- Dependencies: 221
-- Name: Property_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Property_id_seq"', 10, true);


--
-- TOC entry 5031 (class 0 OID 0)
-- Dependencies: 219
-- Name: UserRole_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."UserRole_id_seq"', 9, true);


--
-- TOC entry 5032 (class 0 OID 0)
-- Dependencies: 225
-- Name: Vote_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Vote_id_seq"', 5, true);


--
-- TOC entry 4790 (class 2606 OID 25796)
-- Name: Account Account_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Account"
    ADD CONSTRAINT "Account_pkey" PRIMARY KEY (id);


--
-- TOC entry 4778 (class 2606 OID 25762)
-- Name: CommentReply CommentReply_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."CommentReply"
    ADD CONSTRAINT "CommentReply_pkey" PRIMARY KEY (id);


--
-- TOC entry 4772 (class 2606 OID 25742)
-- Name: Comment Comment_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Comment"
    ADD CONSTRAINT "Comment_pkey" PRIMARY KEY (id);


--
-- TOC entry 4782 (class 2606 OID 25772)
-- Name: LikeComment LikeComment_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."LikeComment"
    ADD CONSTRAINT "LikeComment_pkey" PRIMARY KEY (id);


--
-- TOC entry 4774 (class 2606 OID 25752)
-- Name: Like Like_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Like"
    ADD CONSTRAINT "Like_pkey" PRIMARY KEY (id);


--
-- TOC entry 4801 (class 2606 OID 28118)
-- Name: PropertyDocument PropertyDocument_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."PropertyDocument"
    ADD CONSTRAINT "PropertyDocument_pkey" PRIMARY KEY (id);


--
-- TOC entry 4765 (class 2606 OID 25712)
-- Name: PropertyImage PropertyImage_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."PropertyImage"
    ADD CONSTRAINT "PropertyImage_pkey" PRIMARY KEY (id);


--
-- TOC entry 4798 (class 2606 OID 28108)
-- Name: PropertyVideo PropertyVideo_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."PropertyVideo"
    ADD CONSTRAINT "PropertyVideo_pkey" PRIMARY KEY (id);


--
-- TOC entry 4770 (class 2606 OID 25732)
-- Name: PropertyVote PropertyVote_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."PropertyVote"
    ADD CONSTRAINT "PropertyVote_pkey" PRIMARY KEY (id);


--
-- TOC entry 4763 (class 2606 OID 25701)
-- Name: Property Property_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Property"
    ADD CONSTRAINT "Property_pkey" PRIMARY KEY (id);


--
-- TOC entry 4793 (class 2606 OID 25803)
-- Name: Session Session_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Session"
    ADD CONSTRAINT "Session_pkey" PRIMARY KEY (id);


--
-- TOC entry 4760 (class 2606 OID 25689)
-- Name: UserRole UserRole_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."UserRole"
    ADD CONSTRAINT "UserRole_pkey" PRIMARY KEY (id);


--
-- TOC entry 4758 (class 2606 OID 25679)
-- Name: User User_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_pkey" PRIMARY KEY (id);


--
-- TOC entry 4767 (class 2606 OID 25722)
-- Name: Vote Vote_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Vote"
    ADD CONSTRAINT "Vote_pkey" PRIMARY KEY (id);


--
-- TOC entry 4755 (class 2606 OID 25667)
-- Name: _prisma_migrations _prisma_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public._prisma_migrations
    ADD CONSTRAINT _prisma_migrations_pkey PRIMARY KEY (id);


--
-- TOC entry 4785 (class 2606 OID 25781)
-- Name: coin_balances coin_balances_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.coin_balances
    ADD CONSTRAINT coin_balances_pkey PRIMARY KEY (id);


--
-- TOC entry 4788 (class 2606 OID 25789)
-- Name: coin_transactions coin_transactions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.coin_transactions
    ADD CONSTRAINT coin_transactions_pkey PRIMARY KEY (id);


--
-- TOC entry 4791 (class 1259 OID 25820)
-- Name: Account_provider_providerAccountId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Account_provider_providerAccountId_key" ON public."Account" USING btree (provider, "providerAccountId");


--
-- TOC entry 4776 (class 1259 OID 25816)
-- Name: CommentReply_commentId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "CommentReply_commentId_idx" ON public."CommentReply" USING btree ("commentId");


--
-- TOC entry 4779 (class 1259 OID 25817)
-- Name: CommentReply_propertyId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "CommentReply_propertyId_idx" ON public."CommentReply" USING btree ("propertyId");


--
-- TOC entry 4780 (class 1259 OID 25815)
-- Name: CommentReply_userId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "CommentReply_userId_idx" ON public."CommentReply" USING btree ("userId");


--
-- TOC entry 4783 (class 1259 OID 25818)
-- Name: LikeComment_userId_commentId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "LikeComment_userId_commentId_key" ON public."LikeComment" USING btree ("userId", "commentId");


--
-- TOC entry 4775 (class 1259 OID 25814)
-- Name: Like_propertyId_userId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Like_propertyId_userId_key" ON public."Like" USING btree ("propertyId", "userId");


--
-- TOC entry 4802 (class 1259 OID 28129)
-- Name: PropertyDocument_propertyId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "PropertyDocument_propertyId_idx" ON public."PropertyDocument" USING btree ("propertyId");


--
-- TOC entry 4799 (class 1259 OID 28130)
-- Name: PropertyVideo_propertyId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "PropertyVideo_propertyId_idx" ON public."PropertyVideo" USING btree ("propertyId");


--
-- TOC entry 4794 (class 1259 OID 25821)
-- Name: Session_sessionToken_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Session_sessionToken_key" ON public."Session" USING btree ("sessionToken");


--
-- TOC entry 4761 (class 1259 OID 25812)
-- Name: UserRole_userId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "UserRole_userId_idx" ON public."UserRole" USING btree ("userId");


--
-- TOC entry 4756 (class 1259 OID 25811)
-- Name: User_email_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "User_email_key" ON public."User" USING btree (email);


--
-- TOC entry 4795 (class 1259 OID 25948)
-- Name: VerificationToken_identifier_token_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "VerificationToken_identifier_token_key" ON public."VerificationToken" USING btree (identifier, token);


--
-- TOC entry 4796 (class 1259 OID 25822)
-- Name: VerificationToken_token_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "VerificationToken_token_key" ON public."VerificationToken" USING btree (token);


--
-- TOC entry 4768 (class 1259 OID 25813)
-- Name: Vote_propertyId_userId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Vote_propertyId_userId_key" ON public."Vote" USING btree ("propertyId", "userId");


--
-- TOC entry 4786 (class 1259 OID 25819)
-- Name: coin_balances_userId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "coin_balances_userId_key" ON public.coin_balances USING btree ("userId");


--
-- TOC entry 4826 (class 2606 OID 25938)
-- Name: Account Account_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Account"
    ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 4815 (class 2606 OID 25888)
-- Name: CommentReply CommentReply_commentId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."CommentReply"
    ADD CONSTRAINT "CommentReply_commentId_fkey" FOREIGN KEY ("commentId") REFERENCES public."Comment"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 4816 (class 2606 OID 25893)
-- Name: CommentReply CommentReply_propertyId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."CommentReply"
    ADD CONSTRAINT "CommentReply_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES public."Property"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 4817 (class 2606 OID 25883)
-- Name: CommentReply CommentReply_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."CommentReply"
    ADD CONSTRAINT "CommentReply_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 4810 (class 2606 OID 25868)
-- Name: Comment Comment_parentId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Comment"
    ADD CONSTRAINT "Comment_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES public."Comment"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 4811 (class 2606 OID 25863)
-- Name: Comment Comment_propertyId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Comment"
    ADD CONSTRAINT "Comment_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES public."Property"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 4812 (class 2606 OID 25858)
-- Name: Comment Comment_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Comment"
    ADD CONSTRAINT "Comment_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 4818 (class 2606 OID 25903)
-- Name: LikeComment LikeComment_commentId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."LikeComment"
    ADD CONSTRAINT "LikeComment_commentId_fkey" FOREIGN KEY ("commentId") REFERENCES public."Comment"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 4819 (class 2606 OID 25913)
-- Name: LikeComment LikeComment_propertyId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."LikeComment"
    ADD CONSTRAINT "LikeComment_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES public."Property"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 4820 (class 2606 OID 25908)
-- Name: LikeComment LikeComment_replyId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."LikeComment"
    ADD CONSTRAINT "LikeComment_replyId_fkey" FOREIGN KEY ("replyId") REFERENCES public."CommentReply"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 4821 (class 2606 OID 25898)
-- Name: LikeComment LikeComment_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."LikeComment"
    ADD CONSTRAINT "LikeComment_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 4813 (class 2606 OID 25873)
-- Name: Like Like_propertyId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Like"
    ADD CONSTRAINT "Like_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES public."Property"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 4814 (class 2606 OID 25878)
-- Name: Like Like_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Like"
    ADD CONSTRAINT "Like_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 4829 (class 2606 OID 28124)
-- Name: PropertyDocument PropertyDocument_propertyId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."PropertyDocument"
    ADD CONSTRAINT "PropertyDocument_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES public."Property"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 4805 (class 2606 OID 25833)
-- Name: PropertyImage PropertyImage_propertyId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."PropertyImage"
    ADD CONSTRAINT "PropertyImage_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES public."Property"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 4828 (class 2606 OID 28119)
-- Name: PropertyVideo PropertyVideo_propertyId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."PropertyVideo"
    ADD CONSTRAINT "PropertyVideo_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES public."Property"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 4808 (class 2606 OID 25848)
-- Name: PropertyVote PropertyVote_propertyId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."PropertyVote"
    ADD CONSTRAINT "PropertyVote_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES public."Property"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 4809 (class 2606 OID 25853)
-- Name: PropertyVote PropertyVote_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."PropertyVote"
    ADD CONSTRAINT "PropertyVote_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 4804 (class 2606 OID 25828)
-- Name: Property Property_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Property"
    ADD CONSTRAINT "Property_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 4827 (class 2606 OID 25943)
-- Name: Session Session_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Session"
    ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 4803 (class 2606 OID 25823)
-- Name: UserRole UserRole_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."UserRole"
    ADD CONSTRAINT "UserRole_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 4806 (class 2606 OID 25838)
-- Name: Vote Vote_propertyId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Vote"
    ADD CONSTRAINT "Vote_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES public."Property"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 4807 (class 2606 OID 25843)
-- Name: Vote Vote_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Vote"
    ADD CONSTRAINT "Vote_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 4822 (class 2606 OID 25918)
-- Name: coin_balances coin_balances_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.coin_balances
    ADD CONSTRAINT "coin_balances_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 4823 (class 2606 OID 25933)
-- Name: coin_transactions coin_transactions_coinBalanceId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.coin_transactions
    ADD CONSTRAINT "coin_transactions_coinBalanceId_fkey" FOREIGN KEY ("coinBalanceId") REFERENCES public.coin_balances(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 4824 (class 2606 OID 25923)
-- Name: coin_transactions coin_transactions_propertyId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.coin_transactions
    ADD CONSTRAINT "coin_transactions_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES public."Property"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 4825 (class 2606 OID 25928)
-- Name: coin_transactions coin_transactions_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.coin_transactions
    ADD CONSTRAINT "coin_transactions_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 5010 (class 0 OID 0)
-- Dependencies: 5
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: postgres
--

REVOKE USAGE ON SCHEMA public FROM PUBLIC;


-- Completed on 2025-04-18 00:22:56

--
-- PostgreSQL database dump complete
--

