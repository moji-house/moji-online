PGDMP      !                }            mojihousedb    17.4    17.4 !    k           0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                           false            l           0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                           false            m           0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                           false            n           1262    16431    mojihousedb    DATABASE     q   CREATE DATABASE mojihousedb WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'th-TH';
    DROP DATABASE mojihousedb;
                     postgres    false            M          0    25668    User 
   TABLE DATA           =  COPY public."User" (id, "firstName", "lastName", email, password, "googleId", "birthDate", "showBirthDate", bio, education, "currentCompany", "previousCompanies", "realEstateExperience", "lineContact", avatar, "backgroundImage", "voteCount", followers, "propertiesCount", "createdAt", "updatedAt", phone) FROM stdin;
    public               postgres    false    218   �       b          0    25790    Account 
   TABLE DATA           �   COPY public."Account" (id, "userId", type, provider, "providerAccountId", refresh_token, access_token, expires_at, token_type, scope, id_token, session_state) FROM stdin;
    public               postgres    false    239   �#       Q          0    25691    Property 
   TABLE DATA             COPY public."Property" (id, title, description, price, address, city, state, zip_code, bedrooms, bathrooms, square_feet, status, phone, line_id, google_map_link, co_agent_commission, co_agent_incentive, co_agent_notes, points, "createdAt", "updatedAt", "userId") FROM stdin;
    public               postgres    false    222   o$       Y          0    25734    Comment 
   TABLE DATA           n   COPY public."Comment" (id, content, "userId", "propertyId", "parentId", "createdAt", "updatedAt") FROM stdin;
    public               postgres    false    230   @'       ]          0    25754    CommentReply 
   TABLE DATA           t   COPY public."CommentReply" (id, content, "userId", "commentId", "propertyId", "createdAt", "updatedAt") FROM stdin;
    public               postgres    false    234   (       [          0    25744    Like 
   TABLE DATA           I   COPY public."Like" (id, "propertyId", "userId", "createdAt") FROM stdin;
    public               postgres    false    232   �)       _          0    25764    LikeComment 
   TABLE DATA           h   COPY public."LikeComment" (id, "userId", "commentId", "replyId", "propertyId", "createdAt") FROM stdin;
    public               postgres    false    236   *       h          0    28110    PropertyDocument 
   TABLE DATA           n   COPY public."PropertyDocument" (id, "documentUrl", title, "createdAt", "updatedAt", "propertyId") FROM stdin;
    public               postgres    false    245   �*       S          0    25703    PropertyImage 
   TABLE DATA           k   COPY public."PropertyImage" (id, "imageUrl", "isMain", "createdAt", "updatedAt", "propertyId") FROM stdin;
    public               postgres    false    224   a+       f          0    28100    PropertyVideo 
   TABLE DATA           h   COPY public."PropertyVideo" (id, "videoUrl", title, "createdAt", "updatedAt", "propertyId") FROM stdin;
    public               postgres    false    243   �-       W          0    25724    PropertyVote 
   TABLE DATA           ]   COPY public."PropertyVote" (id, "propertyId", "userId", "voteType", "createdAt") FROM stdin;
    public               postgres    false    228   B.       c          0    25797    Session 
   TABLE DATA           J   COPY public."Session" (id, "sessionToken", "userId", expires) FROM stdin;
    public               postgres    false    240   �.       O          0    25681    UserRole 
   TABLE DATA           E   COPY public."UserRole" (id, "userId", role, "createdAt") FROM stdin;
    public               postgres    false    220   v/       d          0    25804    VerificationToken 
   TABLE DATA           I   COPY public."VerificationToken" (identifier, token, expires) FROM stdin;
    public               postgres    false    241   �/       U          0    25714    Vote 
   TABLE DATA           U   COPY public."Vote" (id, "propertyId", "userId", "voteType", "createdAt") FROM stdin;
    public               postgres    false    226   Q0       L          0    25659    _prisma_migrations 
   TABLE DATA           �   COPY public._prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) FROM stdin;
    public               postgres    false    217   �0       `          0    25773    coin_balances 
   TABLE DATA           X   COPY public.coin_balances (id, "userId", balance, "createdAt", "updatedAt") FROM stdin;
    public               postgres    false    237   �1       a          0    25782    coin_transactions 
   TABLE DATA           �   COPY public.coin_transactions (id, type, amount, description, "propertyId", "userId", "coinBalanceId", "createdAt") FROM stdin;
    public               postgres    false    238   ~2       o           0    0    CommentReply_id_seq    SEQUENCE SET     C   SELECT pg_catalog.setval('public."CommentReply_id_seq"', 8, true);
          public               postgres    false    233            p           0    0    Comment_id_seq    SEQUENCE SET     >   SELECT pg_catalog.setval('public."Comment_id_seq"', 8, true);
          public               postgres    false    229            q           0    0    LikeComment_id_seq    SEQUENCE SET     C   SELECT pg_catalog.setval('public."LikeComment_id_seq"', 17, true);
          public               postgres    false    235            r           0    0    Like_id_seq    SEQUENCE SET     ;   SELECT pg_catalog.setval('public."Like_id_seq"', 8, true);
          public               postgres    false    231            s           0    0    PropertyDocument_id_seq    SEQUENCE SET     G   SELECT pg_catalog.setval('public."PropertyDocument_id_seq"', 1, true);
          public               postgres    false    244            t           0    0    PropertyImage_id_seq    SEQUENCE SET     E   SELECT pg_catalog.setval('public."PropertyImage_id_seq"', 22, true);
          public               postgres    false    223            u           0    0    PropertyVideo_id_seq    SEQUENCE SET     D   SELECT pg_catalog.setval('public."PropertyVideo_id_seq"', 1, true);
          public               postgres    false    242            v           0    0    PropertyVote_id_seq    SEQUENCE SET     C   SELECT pg_catalog.setval('public."PropertyVote_id_seq"', 7, true);
          public               postgres    false    227            w           0    0    Property_id_seq    SEQUENCE SET     @   SELECT pg_catalog.setval('public."Property_id_seq"', 10, true);
          public               postgres    false    221            x           0    0    UserRole_id_seq    SEQUENCE SET     ?   SELECT pg_catalog.setval('public."UserRole_id_seq"', 9, true);
          public               postgres    false    219            y           0    0    Vote_id_seq    SEQUENCE SET     ;   SELECT pg_catalog.setval('public."Vote_id_seq"', 5, true);
          public               postgres    false    225            M   �  x��T�n�F]���ë���C�0�q���G�Ć79�h��9Ңhڅ�4Y����A���F���tti�Y�h��4��{y��{θ�SgX|�����,�Z���mU��ʇU�GU�D����<�ʟ��e<r�Np��w�$d��#4���	��ҺE�Z6L����^wm#�gʍ��{ݻ����`9ɗU��p=���
e#B�-D(�2&bI7a���5��<]��w �CU@\D^U�	 >�k�z>�>���P��ot*�����ǰD�g��JU�l�����*K�x �C	:��7:���5 x	5�`�'��۳M������sBi!˝��{�[�J����>��/܀|��{|x�ߌ'�x4�3V�^��c�����~��	�?��'p��.A�<O����A̔��y�&�7gr�d���L)�,	��;���ty�eb�Et�21�d�x��u��=��ެ�g�g��S�|��i��3~�Ϻ��O���&�m[�]�)6)c���}kbb�	�i���L2�%b4��M����ۭ)�6�ή�OG&J� .v���D�0�� �/FV�q�?��-����s+����Z��rp>��z>��_�#���$u���b�#�Jm����kR?rZ��$-�=����l��=>��1=o�s$A;t?��.#t�"h����$r�QW�m��:�_�2��.~�"[4��ƅ]�4bS�44��F���e ����aS�'��#z�0qX"'q)6ȵN�!8]�Tx�G!�1��G����R��bʜ� ��8����_<��nx�����z�<�Օ睐K]�BP@����wl��d2�i�e��RFK�9�����jgg��ʖ<����V7�w��:�ц�NvHżܐ^;iZ{^���w�^=O�HB�xj�X�aK׉�rB�~O5I��,Sێ��Iy{����w��쥞FQ+��� ߏgf6M��4�Ѝ�)�4�&�l7�jS�0�Զ255���      b   �   x���K� Eǰ
W`��5L]�	A|PJ)���z���u��%�ܛ�+SA�{Mi�����D�
�\�1����Mt:W	y�S���z����i��T����-��KH	1nz��a���"@@��vS��˳a���X�Ə<&� o~{(z��Ӆ�3�kGoa	Ό��ۯ���q�c��Ǐ|      Q   �  x��Uok1~�~���KrI�A_OD�����nw��^��Wnt���8ec0Y�0�m�QL�nv�'�h��G����y~O��V򓒅*���U򣒇J�J�()�ܲ�}%��<Sr�z���S������U���N �B��:���[�n�nH���R{J�W�s� �A��B���j`��eA��z��Q�ڋh�y�'<��en#�Ҩ����(�$1�.�,ƹ!]�Tr��[9�����S+�edϾO�T�ʲ�)��4�wzA`�+6��~�����|=��%����S�!�3�� �AD* s!���zʗ�ѳV�T����K}���7��n �2>r��.7n覭v9^�i�?�7դ�6;�G������zײ9��
��<���pƎ�1T���~�\X��jX��a<,ޑ� �{�Ӎע�"���b'Ͳ��7�$k7��f%Ν<[k��{�!�~Yo�x�	�t/j��ڱ��^��:�l=�}2��ޝ聠�{Ԙ��;w�����{����7^2j4<~��@��+a*(�4� !�Q�1%� �0�2 5�������:�	��8��H�¿!���912�`�e>�2�B�#ׇ�B�`꾜6�o��v��G^�j(0�w	#���������o^��0������j�=v�ܐ+^�r|�����W������0��~���j� ��      Y   /  x�ő�J1���S��d'�n�'�E�?�Z�"z�Z�+�ެ��k�0y�y��
o���˗�3 �WN		�����K�q�U�?�S�"�$|m�8#|"\NX,9c5��Θ��_�-�Z��r{�qRU*��^�?����9 ���(c�
�:oi�`�r��.�K�O��~�/�������M�C��t������p��p�Ό�#�Bhm��Ƃ��sJ ܯ�F����L���U��V?
ږν����2�ˎ�iM)Lx
7����.x���A��L�����eʗ�LJ�	`�3�      ]   �   x���;N1�k��@���x��Y� �c6�BVQ�B
��@H 
��6s�+�Oc}��GJ�D�I�Z�T��/��_��?��_�o����l����Z����j�	�󭣺�tڃ0Y��f�Ņ�4�@C[,ErJ�9����'I0t�󦞶㝥ri~5���L�g}x*]��������TY�h����lAe	��g%ڈ.�5T9��گ��,镅�����*B0�3XWN$��B���Z�\��      [   �   x���1�0�9>hd;�	�YX��2�
NO�x��0�Ӳ��]���a������� a#(���3��g�SO����^�x\/Y_"���jPH@��	�C��� >K���_�P$xN��D��w/2      _   �   x�}�M
�@��ur�^�C�&�wOЍ�ʴ�E���ގ ]�ǻ}�S:��W)�n���i����]MH�%m�kX�Z&�=���JS��T��p|�����E8&1�N�'

"0m��l�;rr��>��9�U��$2���K4C      h   �   x�u�Y�  ��)� �`����'д�-�҂���d�f2��R�q�4�H�ⲙ7�h�Rc�\*TC4�Ł�;o�lY�%�=�`$K��y�[�4��9�\��������&��aǧ �A��\��x3�Ma&1W�'�H%���	B�P�7�      S   &  x���ˎ�0�����.������H7��`n6`C��i��L'�#��%�O�}��K���E��V���F�ȱ3�^li�9�( �2�B�+�E��k�N��Izg���t'��5�}q/avF��hBY��!�4�A|���oR;L�kz��4g��)��(����1>ם���<��}�K�K|�12�L�)e1���\�N��"+�굱c�t5��;�\X��V�!!,�$�H�4���d���r���L��Bz0�u�~9$��l�r;��J����~���qĘٚYv��Z�|��sj¹H7���8�QBIH#�4����lh���87�bq�
o�Q�/���l{�c,p�J%�%��$�{5��C2���DJ��n���gݹ�������Ȭ���V�M]+n�^��2��}(�?�� �!Y�����a��:!>��%�-�萌od��n��1��֧��꯵�y��G�cDޭ�bX��L.F獽{V45|�6 '�$ B��F{�� �~4�Җ^�>�:�K��y���7K���x
��A� O8Ǩ      f   �   x�u�K� Eǲ�n�?��NЇ�?0e����ɝ��sy3弧��#$2ĭ�����a[(�Y^�W��a�e������\���#)�~Q��S��և�#����-Yv�ph9������W;+%�z4Z����C���La�o�u�1����-�����:      W   �   x���A�0���\���t�؞ō1h QT��ƕ�o����c:L�g�aUNix�<�,T�$��5��5�eD�3�O���w���\���3*�Hb�MSQ#�(�.K�}V�e�xk�5��j��d��1��ι��5      c   �   x�}�A� E�1����E�ҵ����4�Ht����:~��i/����, �y��/��cU2)����?�V?E����0`��0�u|�b�CL�o�|�x�<]:_�;\��x�6dg
�^~FO-���O�      O   j   x�3�LεL+J���4 ����J����R�N��ԼN##S]]CcC+S+S=KKS.s<:���R�p관���j��,���+�J-ǩ�L��ؘ+F��� ��0]      d   Q   x�+��M�H�tH�H�-�I�K�����OΎ/K-�L�LN,��ϋ/��N��4202�50�54Q04�21�20�305����� �~H      U   ]   x�3�4�LεL+J���4 ����J����R���N##S]]CcC+S+3=S.SNS�Ƭl�>K�Ƣ�̼Ҭ�r�M�b���� ���      L   �   x�}�Kj1D�3��>��W��!r��Z'�?'�l�@-�]e�m���D��{9.�	�5t���5�U��c,��`���hH�Jx�JGT�y! M 	���,xF>���B�r��!+�_��v_.oO����Õ������J%�J��{�Ħs0�f��Q1;�bA�+	���s��)u6 ���<;c��V�(���OydV,׽����q���n�?;�x.�=�rZ���\�      `   �   x�}�K�0D��)����$��ō""_��7Ta�F�f��twֺӰ�� (4��.��<�l5e4���om�.0A@��E�A�5{0	 ��r���1|X��Ͼ��PUG�3�e�|�3��/�<�����ǜ2�H��kҨ����*�]F�{ek����i��%R�U�N�      a   �  x�Ŗ͎�0���S�l��8��pI�4��٤i��X�+B��"� ���Q�����XZ)g&���L��`/#  ��Wi�n�:m<m�@ 5�W�w5=W�G5}S�5=�-�絶���_��Ojz=[����t�/��YM?���!Nhw�2�+0���+�m�=�v �ʊ��~� ��5 �_A"�s�iq�ȑVD��[�QK��xz䔹ޕ�]�2�z����,���l�m����Ҿ��о(��~>v��֛ع��:ܨ�ˌ�J����ů�W8�A�#J��x lyB�a�� �Z�H��X�
"A� ��!�\ۺ1Ib�K�`��\���hD`�j݌��a6�e��`��:# 
L]��:0�ܗ	���zs�E���	D\@��.3h�H�0��>J�������ե�V6
�r�`�q�r�$7M15\uE3Xm�e��@�徽��ȴ:9s�����2\� ��A{%E{��
�E㐬������,�b��WT���ȱM�s�/,�fC.b3W��mh0�=���ә�'�.z�&1M�YE��zzȢ��s��㴼��?��c(�2�-���Q+�!3Y.�It���T�����2�:���nV���sg�
���L��ʧ�Ʃ�c����N�E=��9y2�W��`�w�$��|�{�k�JʻH�2����],?9�I�     