type Long = protobuf.Long;

/** Namespace com. */
declare namespace com {

    /** Namespace message. */
    namespace message {

        /** Properties of a S_EXCEPTION_MSG. */
        interface IS_EXCEPTION_MSG {

            /** S_EXCEPTION_MSG code */
            code?: (number|null);
        }

        /** Represents a S_EXCEPTION_MSG. */
        class S_EXCEPTION_MSG implements IS_EXCEPTION_MSG {

            /**
             * Constructs a new S_EXCEPTION_MSG.
             * @param [properties] Properties to set
             */
            constructor(properties?: com.message.IS_EXCEPTION_MSG);

            /** S_EXCEPTION_MSG code. */
            public code: number;

            /**
             * Encodes the specified S_EXCEPTION_MSG message. Does not implicitly {@link com.message.S_EXCEPTION_MSG.verify|verify} messages.
             * @param message S_EXCEPTION_MSG message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: com.message.IS_EXCEPTION_MSG, writer?: protobuf.Writer): protobuf.Writer;

            /**
             * Decodes a S_EXCEPTION_MSG message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns S_EXCEPTION_MSG
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: (protobuf.Reader|Uint8Array), length?: number): com.message.S_EXCEPTION_MSG;
        }

        /** Properties of a CROSS_S_EXCEPTION_MSG. */
        interface ICROSS_S_EXCEPTION_MSG {

            /** CROSS_S_EXCEPTION_MSG playerId */
            playerId?: (number|Long|null);

            /** CROSS_S_EXCEPTION_MSG code */
            code?: (number|null);
        }

        /** Represents a CROSS_S_EXCEPTION_MSG. */
        class CROSS_S_EXCEPTION_MSG implements ICROSS_S_EXCEPTION_MSG {

            /**
             * Constructs a new CROSS_S_EXCEPTION_MSG.
             * @param [properties] Properties to set
             */
            constructor(properties?: com.message.ICROSS_S_EXCEPTION_MSG);

            /** CROSS_S_EXCEPTION_MSG playerId. */
            public playerId: (number|Long);

            /** CROSS_S_EXCEPTION_MSG code. */
            public code: number;

            /**
             * Encodes the specified CROSS_S_EXCEPTION_MSG message. Does not implicitly {@link com.message.CROSS_S_EXCEPTION_MSG.verify|verify} messages.
             * @param message CROSS_S_EXCEPTION_MSG message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: com.message.ICROSS_S_EXCEPTION_MSG, writer?: protobuf.Writer): protobuf.Writer;

            /**
             * Decodes a CROSS_S_EXCEPTION_MSG message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns CROSS_S_EXCEPTION_MSG
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: (protobuf.Reader|Uint8Array), length?: number): com.message.CROSS_S_EXCEPTION_MSG;
        }

        /** Properties of a C_USER_LOGIN. */
        interface IC_USER_LOGIN {

            /** C_USER_LOGIN username */
            username?: (string|null);

            /** C_USER_LOGIN gameSite */
            gameSite?: (string|null);

            /** C_USER_LOGIN sparam */
            sparam?: (string|null);
        }

        /** Represents a C_USER_LOGIN. */
        class C_USER_LOGIN implements IC_USER_LOGIN {

            /**
             * Constructs a new C_USER_LOGIN.
             * @param [properties] Properties to set
             */
            constructor(properties?: com.message.IC_USER_LOGIN);

            /** C_USER_LOGIN username. */
            public username: string;

            /** C_USER_LOGIN gameSite. */
            public gameSite: string;

            /** C_USER_LOGIN sparam. */
            public sparam: string;

            /**
             * Encodes the specified C_USER_LOGIN message. Does not implicitly {@link com.message.C_USER_LOGIN.verify|verify} messages.
             * @param message C_USER_LOGIN message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: com.message.IC_USER_LOGIN, writer?: protobuf.Writer): protobuf.Writer;

            /**
             * Decodes a C_USER_LOGIN message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns C_USER_LOGIN
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: (protobuf.Reader|Uint8Array), length?: number): com.message.C_USER_LOGIN;
        }

        /** Properties of a S_USER_LOGIN. */
        interface IS_USER_LOGIN {

            /** S_USER_LOGIN playerId */
            playerId?: (number|Long|null);
        }

        /** Represents a S_USER_LOGIN. */
        class S_USER_LOGIN implements IS_USER_LOGIN {

            /**
             * Constructs a new S_USER_LOGIN.
             * @param [properties] Properties to set
             */
            constructor(properties?: com.message.IS_USER_LOGIN);

            /** S_USER_LOGIN playerId. */
            public playerId: (number|Long);

            /**
             * Encodes the specified S_USER_LOGIN message. Does not implicitly {@link com.message.S_USER_LOGIN.verify|verify} messages.
             * @param message S_USER_LOGIN message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: com.message.IS_USER_LOGIN, writer?: protobuf.Writer): protobuf.Writer;

            /**
             * Decodes a S_USER_LOGIN message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns S_USER_LOGIN
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: (protobuf.Reader|Uint8Array), length?: number): com.message.S_USER_LOGIN;
        }

        /** Properties of a C_LOGIN_REGISTER. */
        interface IC_LOGIN_REGISTER {

            /** C_LOGIN_REGISTER username */
            username?: (string|null);

            /** C_LOGIN_REGISTER gameSite */
            gameSite?: (string|null);

            /** C_LOGIN_REGISTER nickname */
            nickname?: (string|null);

            /** C_LOGIN_REGISTER heroId */
            heroId?: (number|null);

            /** C_LOGIN_REGISTER sparam */
            sparam?: (string|null);
        }

        /** Represents a C_LOGIN_REGISTER. */
        class C_LOGIN_REGISTER implements IC_LOGIN_REGISTER {

            /**
             * Constructs a new C_LOGIN_REGISTER.
             * @param [properties] Properties to set
             */
            constructor(properties?: com.message.IC_LOGIN_REGISTER);

            /** C_LOGIN_REGISTER username. */
            public username: string;

            /** C_LOGIN_REGISTER gameSite. */
            public gameSite: string;

            /** C_LOGIN_REGISTER nickname. */
            public nickname: string;

            /** C_LOGIN_REGISTER heroId. */
            public heroId: number;

            /** C_LOGIN_REGISTER sparam. */
            public sparam: string;

            /**
             * Encodes the specified C_LOGIN_REGISTER message. Does not implicitly {@link com.message.C_LOGIN_REGISTER.verify|verify} messages.
             * @param message C_LOGIN_REGISTER message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: com.message.IC_LOGIN_REGISTER, writer?: protobuf.Writer): protobuf.Writer;

            /**
             * Decodes a C_LOGIN_REGISTER message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns C_LOGIN_REGISTER
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: (protobuf.Reader|Uint8Array), length?: number): com.message.C_LOGIN_REGISTER;
        }

        /** Properties of a C_USER_LOGOUT. */
        interface IC_USER_LOGOUT {

            /** C_USER_LOGOUT playerId */
            playerId?: (number|Long|null);
        }

        /** Represents a C_USER_LOGOUT. */
        class C_USER_LOGOUT implements IC_USER_LOGOUT {

            /**
             * Constructs a new C_USER_LOGOUT.
             * @param [properties] Properties to set
             */
            constructor(properties?: com.message.IC_USER_LOGOUT);

            /** C_USER_LOGOUT playerId. */
            public playerId: (number|Long);

            /**
             * Encodes the specified C_USER_LOGOUT message. Does not implicitly {@link com.message.C_USER_LOGOUT.verify|verify} messages.
             * @param message C_USER_LOGOUT message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: com.message.IC_USER_LOGOUT, writer?: protobuf.Writer): protobuf.Writer;

            /**
             * Decodes a C_USER_LOGOUT message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns C_USER_LOGOUT
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: (protobuf.Reader|Uint8Array), length?: number): com.message.C_USER_LOGOUT;
        }

        /** Properties of a S_USER_LOGOUT. */
        interface IS_USER_LOGOUT {

            /** S_USER_LOGOUT playerId */
            playerId?: (number|Long|null);

            /** S_USER_LOGOUT beKickOut */
            beKickOut?: (boolean|null);
        }

        /** Represents a S_USER_LOGOUT. */
        class S_USER_LOGOUT implements IS_USER_LOGOUT {

            /**
             * Constructs a new S_USER_LOGOUT.
             * @param [properties] Properties to set
             */
            constructor(properties?: com.message.IS_USER_LOGOUT);

            /** S_USER_LOGOUT playerId. */
            public playerId: (number|Long);

            /** S_USER_LOGOUT beKickOut. */
            public beKickOut: boolean;

            /**
             * Encodes the specified S_USER_LOGOUT message. Does not implicitly {@link com.message.S_USER_LOGOUT.verify|verify} messages.
             * @param message S_USER_LOGOUT message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: com.message.IS_USER_LOGOUT, writer?: protobuf.Writer): protobuf.Writer;

            /**
             * Decodes a S_USER_LOGOUT message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns S_USER_LOGOUT
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: (protobuf.Reader|Uint8Array), length?: number): com.message.S_USER_LOGOUT;
        }

        /** Properties of a S_USER_LOGIN_BAN. */
        interface IS_USER_LOGIN_BAN {
        }

        /** Represents a S_USER_LOGIN_BAN. */
        class S_USER_LOGIN_BAN implements IS_USER_LOGIN_BAN {

            /**
             * Constructs a new S_USER_LOGIN_BAN.
             * @param [properties] Properties to set
             */
            constructor(properties?: com.message.IS_USER_LOGIN_BAN);

            /**
             * Encodes the specified S_USER_LOGIN_BAN message. Does not implicitly {@link com.message.S_USER_LOGIN_BAN.verify|verify} messages.
             * @param message S_USER_LOGIN_BAN message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: com.message.IS_USER_LOGIN_BAN, writer?: protobuf.Writer): protobuf.Writer;

            /**
             * Decodes a S_USER_LOGIN_BAN message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns S_USER_LOGIN_BAN
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: (protobuf.Reader|Uint8Array), length?: number): com.message.S_USER_LOGIN_BAN;
        }

        /** Properties of a C_SYNC_TIME. */
        interface IC_SYNC_TIME {
        }

        /** Represents a C_SYNC_TIME. */
        class C_SYNC_TIME implements IC_SYNC_TIME {

            /**
             * Constructs a new C_SYNC_TIME.
             * @param [properties] Properties to set
             */
            constructor(properties?: com.message.IC_SYNC_TIME);

            /**
             * Encodes the specified C_SYNC_TIME message. Does not implicitly {@link com.message.C_SYNC_TIME.verify|verify} messages.
             * @param message C_SYNC_TIME message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: com.message.IC_SYNC_TIME, writer?: protobuf.Writer): protobuf.Writer;

            /**
             * Decodes a C_SYNC_TIME message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns C_SYNC_TIME
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: (protobuf.Reader|Uint8Array), length?: number): com.message.C_SYNC_TIME;
        }

        /** Properties of a S_SYNC_TIME. */
        interface IS_SYNC_TIME {

            /** S_SYNC_TIME time */
            time?: (number|Long|null);
        }

        /** Represents a S_SYNC_TIME. */
        class S_SYNC_TIME implements IS_SYNC_TIME {

            /**
             * Constructs a new S_SYNC_TIME.
             * @param [properties] Properties to set
             */
            constructor(properties?: com.message.IS_SYNC_TIME);

            /** S_SYNC_TIME time. */
            public time: (number|Long);

            /**
             * Encodes the specified S_SYNC_TIME message. Does not implicitly {@link com.message.S_SYNC_TIME.verify|verify} messages.
             * @param message S_SYNC_TIME message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: com.message.IS_SYNC_TIME, writer?: protobuf.Writer): protobuf.Writer;

            /**
             * Decodes a S_SYNC_TIME message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns S_SYNC_TIME
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: (protobuf.Reader|Uint8Array), length?: number): com.message.S_SYNC_TIME;
        }

        /** Properties of a C_GET_NICKNAME_INFO. */
        interface IC_GET_NICKNAME_INFO {

            /** C_GET_NICKNAME_INFO nickName */
            nickName?: (string|null);
        }

        /** Represents a C_GET_NICKNAME_INFO. */
        class C_GET_NICKNAME_INFO implements IC_GET_NICKNAME_INFO {

            /**
             * Constructs a new C_GET_NICKNAME_INFO.
             * @param [properties] Properties to set
             */
            constructor(properties?: com.message.IC_GET_NICKNAME_INFO);

            /** C_GET_NICKNAME_INFO nickName. */
            public nickName: string;

            /**
             * Encodes the specified C_GET_NICKNAME_INFO message. Does not implicitly {@link com.message.C_GET_NICKNAME_INFO.verify|verify} messages.
             * @param message C_GET_NICKNAME_INFO message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: com.message.IC_GET_NICKNAME_INFO, writer?: protobuf.Writer): protobuf.Writer;

            /**
             * Decodes a C_GET_NICKNAME_INFO message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns C_GET_NICKNAME_INFO
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: (protobuf.Reader|Uint8Array), length?: number): com.message.C_GET_NICKNAME_INFO;
        }

        /** Properties of a S_GET_NICKNAME_INFO. */
        interface IS_GET_NICKNAME_INFO {

            /** S_GET_NICKNAME_INFO nickName */
            nickName?: (string|null);

            /** S_GET_NICKNAME_INFO canUse */
            canUse?: (boolean|null);
        }

        /** Represents a S_GET_NICKNAME_INFO. */
        class S_GET_NICKNAME_INFO implements IS_GET_NICKNAME_INFO {

            /**
             * Constructs a new S_GET_NICKNAME_INFO.
             * @param [properties] Properties to set
             */
            constructor(properties?: com.message.IS_GET_NICKNAME_INFO);

            /** S_GET_NICKNAME_INFO nickName. */
            public nickName: string;

            /** S_GET_NICKNAME_INFO canUse. */
            public canUse: boolean;

            /**
             * Encodes the specified S_GET_NICKNAME_INFO message. Does not implicitly {@link com.message.S_GET_NICKNAME_INFO.verify|verify} messages.
             * @param message S_GET_NICKNAME_INFO message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: com.message.IS_GET_NICKNAME_INFO, writer?: protobuf.Writer): protobuf.Writer;

            /**
             * Decodes a S_GET_NICKNAME_INFO message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns S_GET_NICKNAME_INFO
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: (protobuf.Reader|Uint8Array), length?: number): com.message.S_GET_NICKNAME_INFO;
        }

        /** Properties of a C_SEND_SDK_DATA. */
        interface IC_SEND_SDK_DATA {

            /** C_SEND_SDK_DATA reportStr */
            reportStr?: (string|null);

            /** C_SEND_SDK_DATA reportUrl */
            reportUrl?: (string|null);
        }

        /** Represents a C_SEND_SDK_DATA. */
        class C_SEND_SDK_DATA implements IC_SEND_SDK_DATA {

            /**
             * Constructs a new C_SEND_SDK_DATA.
             * @param [properties] Properties to set
             */
            constructor(properties?: com.message.IC_SEND_SDK_DATA);

            /** C_SEND_SDK_DATA reportStr. */
            public reportStr: string;

            /** C_SEND_SDK_DATA reportUrl. */
            public reportUrl: string;

            /**
             * Encodes the specified C_SEND_SDK_DATA message. Does not implicitly {@link com.message.C_SEND_SDK_DATA.verify|verify} messages.
             * @param message C_SEND_SDK_DATA message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: com.message.IC_SEND_SDK_DATA, writer?: protobuf.Writer): protobuf.Writer;

            /**
             * Decodes a C_SEND_SDK_DATA message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns C_SEND_SDK_DATA
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: (protobuf.Reader|Uint8Array), length?: number): com.message.C_SEND_SDK_DATA;
        }

        /** Properties of a S_SEND_SDK_DATA. */
        interface IS_SEND_SDK_DATA {

            /** S_SEND_SDK_DATA canUse */
            canUse?: (boolean|null);
        }

        /** Represents a S_SEND_SDK_DATA. */
        class S_SEND_SDK_DATA implements IS_SEND_SDK_DATA {

            /**
             * Constructs a new S_SEND_SDK_DATA.
             * @param [properties] Properties to set
             */
            constructor(properties?: com.message.IS_SEND_SDK_DATA);

            /** S_SEND_SDK_DATA canUse. */
            public canUse: boolean;

            /**
             * Encodes the specified S_SEND_SDK_DATA message. Does not implicitly {@link com.message.S_SEND_SDK_DATA.verify|verify} messages.
             * @param message S_SEND_SDK_DATA message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: com.message.IS_SEND_SDK_DATA, writer?: protobuf.Writer): protobuf.Writer;

            /**
             * Decodes a S_SEND_SDK_DATA message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns S_SEND_SDK_DATA
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: (protobuf.Reader|Uint8Array), length?: number): com.message.S_SEND_SDK_DATA;
        }
    }
}
