PGDMP  (    $                }         	   mojihouse    17.4    17.4     9           0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                           false            :           0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                           false            ;           0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                           false            <           1262    16386 	   mojihouse    DATABASE     o   CREATE DATABASE mojihouse WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'th-TH';
    DROP DATABASE mojihouse;
                     postgres    false            $          0    17383    User 
   TABLE DATA           /  COPY public."User" (id, "firstName", "lastName", email, password, "birthDate", "showBirthDate", bio, education, "currentCompany", "previousCompanies", "realEstateExperience", "lineContact", avatar, "backgroundImage", votes, followers, properties, "createdAt", "updatedAt", "googleId", role) FROM stdin;
    public               postgres    false    219   �       (          0    17407    Property 
   TABLE DATA             COPY public."Property" (id, title, description, price, points, "userId", "createdAt", "updatedAt", address, bathrooms, bedrooms, city, co_agent_commission, co_agent_incentive, co_agent_notes, google_map_link, line_id, phone, square_feet, state, status, zip_code) FROM stdin;
    public               postgres    false    223   E       0          0    17448    Comment 
   TABLE DATA           U   COPY public."Comment" (id, content, "propertyId", "userId", "createdAt") FROM stdin;
    public               postgres    false    231           4          0    18698    CommentReply 
   TABLE DATA           t   COPY public."CommentReply" (id, content, "commentId", "userId", "propertyId", "createdAt", "updatedAt") FROM stdin;
    public               postgres    false    235   {        2          0    17458    Like 
   TABLE DATA           I   COPY public."Like" (id, "propertyId", "userId", "createdAt") FROM stdin;
    public               postgres    false    233   �        6          0    18726    LikeComment 
   TABLE DATA           o   COPY public."LikeComment" (id, "commentId", "commentReplyId", "propertyId", "userId", "createdAt") FROM stdin;
    public               postgres    false    237   �        *          0    17418    PropertyImage 
   TABLE DATA           k   COPY public."PropertyImage" (id, "propertyId", "createdAt", "imageUrl", "isMain", "updatedAt") FROM stdin;
    public               postgres    false    225   
!       .          0    17438    PropertyVote 
   TABLE DATA           ]   COPY public."PropertyVote" (id, "propertyId", "userId", "voteType", "createdAt") FROM stdin;
    public               postgres    false    229    "       &          0    17397    UserRole 
   TABLE DATA           E   COPY public."UserRole" (id, "userId", role, "createdAt") FROM stdin;
    public               postgres    false    221   �"       ,          0    17428    Vote 
   TABLE DATA           U   COPY public."Vote" (id, "propertyId", "userId", "voteType", "createdAt") FROM stdin;
    public               postgres    false    227   �"       "          0    16749    _prisma_migrations 
   TABLE DATA           �   COPY public._prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) FROM stdin;
    public               postgres    false    217   #       =           0    0    CommentReply_id_seq    SEQUENCE SET     D   SELECT pg_catalog.setval('public."CommentReply_id_seq"', 1, false);
          public               postgres    false    234            >           0    0    Comment_id_seq    SEQUENCE SET     >   SELECT pg_catalog.setval('public."Comment_id_seq"', 4, true);
          public               postgres    false    230            ?           0    0    LikeComment_id_seq    SEQUENCE SET     C   SELECT pg_catalog.setval('public."LikeComment_id_seq"', 1, false);
          public               postgres    false    236            @           0    0    Like_id_seq    SEQUENCE SET     ;   SELECT pg_catalog.setval('public."Like_id_seq"', 9, true);
          public               postgres    false    232            A           0    0    PropertyImage_id_seq    SEQUENCE SET     D   SELECT pg_catalog.setval('public."PropertyImage_id_seq"', 6, true);
          public               postgres    false    224            B           0    0    PropertyVote_id_seq    SEQUENCE SET     D   SELECT pg_catalog.setval('public."PropertyVote_id_seq"', 17, true);
          public               postgres    false    228            C           0    0    Property_id_seq    SEQUENCE SET     @   SELECT pg_catalog.setval('public."Property_id_seq"', 17, true);
          public               postgres    false    222            D           0    0    UserRole_id_seq    SEQUENCE SET     ?   SELECT pg_catalog.setval('public."UserRole_id_seq"', 6, true);
          public               postgres    false    220            E           0    0    User_id_seq    SEQUENCE SET     ;   SELECT pg_catalog.setval('public."User_id_seq"', 3, true);
          public               postgres    false    218            F           0    0    Vote_id_seq    SEQUENCE SET     <   SELECT pg_catalog.setval('public."Vote_id_seq"', 1, false);
          public               postgres    false    226            $   �  x��U�n�8}6_�J�R;$� �4ʴ�tJ�i�h��	&1�ĩ�@�a�}oBKa�H��
�8ν�Ϲ��8h�2�Ʃ01Z�����3fi�p+�):q�'��\���ׁ�����.���}��V�ƽك|���f���-s����馰�SD߫�N=LH�h�n�̹2k,WW�e3,�%�F*���c�s��\&Bb9Ǌk1�,��6Wpm�!��!�ãsm��Ǘ<�y
	��[�Ҕif��L,��¬�x��n'���_V'(�4��9S��:=��`�K�g!G�1�n�v"����Fع�W�eE���2-4We�! *&��Wv���ȣ]�HY�L�	�qY
;����e�x���F=�$ ^��|ΐ�6�O=�:@�['&��K�Է�G����5�P�1�	�(�J�wִ��_5�׉_wț&�*ȷe���0`Z�<�����"� <JS��ߕ�aaE��p��X�B�S|U&e�Y�?��
��o<�3��hB�ٴPb��@P��q`#4�����)�|�BAT�y���)�?q��/��+���rJ�8��	r�R;G��]���E+�t�bfI��h�_f�����M$e��_������6�`�h��6����]���g�ȗ��:Z6�A���y��z�x�w�}llZ��i�>��������f=,_B����)`rڤi5��:���kx.�Z��[�m��)�8C=��À�t���:�0��r�k>�uA��0U���E��s��
m���(�B����g�Td�2;�ݸHXRzF�l�q�u���@��v��_�0~5./�;N��B��<[u��}r���3���F@�|Φ=�Z�$���빳��ߏ������f=zXތ&��3z���䑪;�;�iY�5|[�O��vm�Z~3 }9��s�6�f��V��O�V��wp�      (   �  x��X�j#7���B/����X
�U/v)m�d1op������ݤ�x��BI���C̖��P�m�}���l�?uR�m.�L�����i%����dS��<R�����y�dg�Jv����J6��U�\Ɂ�H�	�D!�G�<V�R߂$`렒�R=)p��xG:y�����רy?%���w5�ƶ��U���5�>�a����¼&��%�px�h���TP�D�R�=�k�{h�	E��� �un\B�!0�����vQ�!<A�L(���K\�z�K%O�OP�����]t�� q-��C�e2�M��z}��d���N�)V��R�٨�����V��]�����x����n�О�P���7�[��3�Y&&`h��&�X��r^`��1݇���%���0Rh
Vd��C���kA|��h�RǠ��yYK�O�~DvJm�.���Ȅy"Ƹ�ĝ�$�L�M�Y?��p�H�D�Z�{g�	�+L��Z�Bm,l�,�zȊu.{3�=[.z�Y
50�iPw��G�h}U�3c�Ōe8P��h�����6D��C*($2�I�{3P:�w)���.�q��g����A�0A����(:X�@�*A�£oZ�$P�F-�Ȱ{?���2���#ө0��&B��5a)��o��Di�bQ�!FbF&D�"�ϴ�1���1�ow����9~��J5��l[Wvc4����j����I�j����m�����3T�4�C���_��7��� �E1��=¬�)�}k@o�:8�1| kZwڂ���	_�V���������)V� 3n�-s�8�U�cD��&?�.Lç[ѭ�r���Cx0�p��ćˉ�Eӑ��j5���R�R�����+����&�p1/�'�|�X�*Ȇ��o���������^~�:���m��,�1���pʅl}+��}�Qz��e����-��?���D�E����x*��/�0a,�C�|�p�����TO%�IJ����]<�XK" _���B��j�[��{|Oz�S�%KD�01�-��#�H|�a<���?n�^��~�T��<��qG��y\���)���6�/8�� �p��E����y�?�?�|�|�w�"��	�M��D�L���pb��]�GQ
���͏�AH��x>�&���rۇw����	 �"}}B��)����ӡs6S"���p<R&<N����s⣨����d���u      0   c   x�u��	�0@�s2EhH���N��

b/G��_`������@�d�5r	�U��N�)�����7�T��TD1�]}�$�*g2qTXְ�?Ȝl��O� %      4      x������ � �      2   E   x�mɹ�0 ���F�f��s$e�Hם�$(kl�͹��^Ml��I�R߮�g,��$^B�L�      6      x������ � �      *     x���;r�0��V���f-n�HH V�4��L<�[�o��(Bi�!f7Ho�} �S��{�#j�e�9 Fڤ���MHJ= !����%pS�� e��S
1�ѓ4K+-����b+W0���P�L���z��`��`�u���7]���O`�*Xv��j��3�Zٶ^m��F#��>���A��%GX�C]�U��A�Uy���}o��*�Kc���z���զ+�	,�
�^�WR;'���D���Mc?�g��':5      .   Y   x�u���@��]`y��q�z R�_�O���C ��{	��z�>��
sPP/&�isR������H�^
��c���Ű�����0�      &   Z   x�3�4�tLO�+�4202�50�50R00�21�24׳�0�2��/�K-©��z�\&@�̀�0�4�k�	�P>3L�b���� �*�      ,      x������ � �      "   �   x�e�K
�0��)�/�X��C����2d�U�O�no5�<�^�;f�i���-{�]�J�R+���m��U�Ϡh1�Ā�<�6�/!6�غNZH��膼	m+�2�;��BB����k���xu��5����-     