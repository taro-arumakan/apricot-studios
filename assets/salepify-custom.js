const tlPopupCartReRender = async () => {
    const themeName = window?.Shopify?.theme?.schema_name;

    if (!themeName) {
        window.location.reload();
        return;
    }

    // Prevent reloading - Dawn || Generated Data Theme || Shrine
    if (["Dawn", "Generated Data Theme", "Shrine"].includes(themeName)) {
        try {
            const cartItemsSelector = window.location.pathname === "/cart" ? "cart-items" : "cart-drawer-items";
            const cartItemsElement = document.querySelector(cartItemsSelector);
            const sectionsToReRender = cartItemsElement.getSectionsToRender();

            const response = await fetch(`/?sections=${sectionsToReRender.map((s) => s.section).join(",")}`);
            const htmlMap = await response.json();

            sectionsToReRender.forEach(({ id, section, selector }) => {
                const newHTML = new DOMParser().parseFromString(htmlMap[section], "text/html").querySelector(selector)?.innerHTML;
                const targetElement = document.getElementById(id)?.querySelector(selector) || document.getElementById(id);
                if (newHTML && targetElement) targetElement.innerHTML = newHTML;
            });

            await window.tlAdvancedFreeGift.updateCartData();

            return;
        } catch (error) {
            console.error("Error while re-rendering cart element:", error);
            window.location.reload();
            return;
        }
    }

    window.location.reload();
};

class tlAdvancedFreeGift {
    LOCAL_STORAGE = "tl-advanced-free-gift-local-storage";
    SESSION_STORAGE = "tl-advanced-free-gift-session-storage";
    IMPRESSION_KEY = "salepify_popup_impressions";
    PROXY_URL = "apps/salepify";
    PROPERTY = "_salepify-advanced-fg";
    API_VERSION = "2025-01";
    ROW_PER_PAGE = 5;
    
    POPUP_LAYOUT = {
        DETAILED_LIST: "detailed_list",
        GIFTS_ONLY: "gifts_only",
    };
    
    POPUP_ANIMATION = {
        FADE_IN: "fade_in",
        SLIDE_IN_UP: "slide_in_up",
        SLIDE_IN_DOWN: "slide_in_down",
        SLIDE_IN_LEFT: "slide_in_left",
        SLIDE_IN_RIGHT: "slide_in_right",
        ZOOM_IN: "zoom_in",
    };
    
    POSITION_OF_POPUP = {
        BOTTOM_RIGHT: "bottom-right",
        BOTTOM_LEFT: "bottom-left",
        CENTER_LEFT: "center-left",
        CENTER_RIGHT: "center-right",
    };
    
    APPLY_TO_PRODUCT = {
        ALL: "all",
        COLLECTION: "collection",
        PRODUCT: "product",
        VARIANT: "variant",
        TAG: "tag",
    };
    
    COUNTRY_TARGET_TYPE = {
        INCLUDE: "include",
        EXCLUDE: "exclude",
    };
    
    APPLY_CONDITION_TYPE = {
        AMOUNT: "amount",
        QUANTITY: "quantity",
    };
    
    CUSTOMER_TARGET = {
        ALL: "all",
        NOT_LOGGED: "not_logged",
        LOGGED_IN: "logged_in",
        CUSTOMER_TAG: "customer_tag",
        SPECIFIC_CUSTOMER: "specific_customer",
        ORDER_COUNT: "order_count",
        TOTAL_SPENT: "total_spent",
    };
    
    SHOW_ON_PAGES = {
        ALL: "all",
        PRODUCT: "product_page",
        HOME: "home_page",
        COLLECTION: "collection_page",
        CART: "cart_page",
        SPECIFIC: "specific_page",
    };
    
    CONDITION_STATE = {
        NOT_MET: "not_met",
        MET_BEFORE_CLAIM: "met_before_claim",
        MET_AFTER_CLAIM: "met_after_claim",
    };
    
    AUTO_ADD_TYPE = {
        FIRST_AVAILABLE: "first_available",
        SELECT_TO_ADD: "select_to_add",
    };
    
    GIFT_TYPE = {
        VARIANT: "variant",
        COLLECTION: "collection",
        SAME_BUY: "same_buy",
    };
    
    DISCOUNT_TYPE = {
        NO_DISCOUNT: "none",
        PERCENTAGE: "percentage",
        FIXED: "fixed",
        FIXED_PRICE: "fixed_price",
    };
    
    ADVANCED_CONDITION = {
        SPECIFIC_COUNTRY: "specific_country",
        CUSTOMER_TAG: "customer_tag",
        SPECIFIC_CUSTOMER: "specific_customer",
        CUSTOMER_STATUS: "customer_status",
        ORDER_COUNT: "order_count",
        TOTAL_SPENT: "total_spent",
    };
    
    CUSTOMER_STATUS = {
        NOT_LOGGED: "not_logged",
        LOGGED_IN: "logged_in",
    };
    
    ALIGNMENT = {
        START: "start",
        CENTER: "center",
        END: "end",
    };
    
    DEFAULT_DISPLAY_SETTING = {
        [this.POPUP_LAYOUT.DETAILED_LIST]: {
            container: {
                border_radius: 12,
                border_width: 0,
                border_color: "#D9D9D9",
                background_color: "#FFFFFF",
                font_family: "inherit",
            },
            header: {
                title: {
                    font_size: 20,
                    font_weight: 700,
                    color: "#1E1E1E",
                },
                subtitle: {
                    font_size: 16,
                    font_weight: 400,
                    color: "#6B7280",
                },
                alignment: this.ALIGNMENT.CENTER,
                close_btn: {
                    color: "#9CA3AF",
                },
            },
            product_block: {
                border_radius: 8,
                border_color: "#D1D5DB",
                background_color: "#FFFFFF",
                eligible: {
                    border_color: "#4338CA",
                    background_color: "#E0E7FF",
                },
                padding: {
                    top: 16,
                    right: 24,
                    bottom: 16,
                    left: 24,
                },
                gap: 16,
            },
            main_section: {
                offer_title: {
                    font_size: 18,
                    font_weight: 700,
                    color: "#000000",
                },
                toggle_button: {
                    font_size: 14,
                    font_weight: 600,
                    color: "#4F46E5",
                },
            },
            product_image: {
                border_radius: 4,
                border_color: "#CCCCCC",
            },
            product_item: {
                title: {
                    font_size: 16,
                    font_weight: 600,
                    color: "#111827",
                },
                free_text: {
                    font_size: 14,
                    font_weight: 600,
                    color: "#059669",
                },
                price: {
                    font_size: 13,
                    font_weight: 400,
                    color: "#6B7280",
                },
                gap: 12,
            },
            upsell_msg: {
                font_size: 16,
                font_weight: 700,
                color: "#FFFFFF",
                background_color: "#4F46E5",
                padding: 12,
            },
            add_btn: {
                icon_color: "#FFFFFF",
                background_color: "#4F46E5",
            },
            claim_btn: {
                font_size: 16,
                font_weight: 700,
                color: "#FFFFFF",
                background_color: "#4F46E5",
                padding: 12,
                selected_text: {
                    color: "#4F46E5",
                },
            },
            icon_popup: {
                is_icon_displayed: true,
                position: this.POSITION_OF_POPUP.BOTTOM_RIGHT,
                color: "#000000",
                icon_color: "#8614dd",
                icon_size: 65,
                background_color: "#FFFFFF",
                border_color: "#FFFFFF",
                border_radius: 35,
                border_width: 0,
                adv_free_gift_image: null,
            },
            animation: {
                popup_transition: this.POPUP_ANIMATION.FADE_IN,
                show_confetti: true,
            },
            custom_css: "",
        },
        [this.POPUP_LAYOUT.GIFTS_ONLY]: {
            container: {
                border_radius: 12,
                border_width: 0,
                border_color: "#D9D9D9",
                background_color: "#FFFFFF",
                font_family: "inherit",
            },
            header: {
                background_color: "#FFCCCC",
                title: {
                    font_size: 20,
                    font_weight: 700,
                    color: "#1E1E1E",
                },
                subtitle: {
                    font_size: 16,
                    font_weight: 400,
                    color: "#6B7280",
                },
                alignment: this.ALIGNMENT.CENTER,
                padding: 16,
                close_btn: {
                    color: "#9CA3AF",
                },
            },
            product_block: {
                border_radius: 4,
                border_color: "#CCCCCC",
                background_color: "#FFFFFF",
                padding: {
                    top: 16,
                    right: 16,
                    bottom: 16,
                    left: 16,
                },
                gap: 16,
            },
            product_image: {
                border_radius: 2,
                border_color: "#CCCCCC",
            },
            product_item: {
                title: {
                    font_size: 16,
                    font_weight: 600,
                    color: "#111827",
                },
                free_text: {
                    font_size: 14,
                    font_weight: 600,
                    color: "#FF0000",
                },
                price: {
                    font_size: 13,
                    font_weight: 400,
                    color: "#6B7280",
                },
                gap: 16,
            },
            add_btn: {
                font_size: 13,
                font_weight: 600,
                color: "#000000",
                background_color: "#FFFFFF",
            },
            claim_btn: {
                font_size: 16,
                font_weight: 700,
                color: "#FFFFFF",
                background_color: "#000000",
                padding: 12,
            },
            animation: {
                popup_transition: this.POPUP_ANIMATION.FADE_IN,
                show_confetti: true,
            },
            custom_css: "",
        },
    };    
    
    DEFAULT_GENERAL_TRANSLATION = {
        [this.POPUP_LAYOUT.DETAILED_LIST]: {
            header: {
                title: "Claim these awesome free gifts!",
                subtitle: "Shop now before they're gone",
            }
        }
    }

    DEFAULT_RULE_SPECIFIC_TRANSLATION = {
        [this.POPUP_LAYOUT.DETAILED_LIST]: {
            main_offer: {
                offer_title: "Spend {{remain}} on any products to get rewards",
                eligible_offer_title: "Congratulations! You’ve received a reward",
                view_more: "View more",
                view_less: "View less",
            },
            upsell_msg: {
                not_meet_condition: "Buy {{remain}} more to unlock your reward",
                meet_condition: "You can select {{gift_number}} reward",
                claimed: "You claimed all rewards",
                for_auto_add: "You’ll receive {{gift_number}} rewards",
            },
            product_detail: {
                free_text_content: "Free",
            },
            manual_choose_gift: {
                selected_text: "Selected",
                claim_btn: "Claim",
                claimed_btn: "Claimed",
                choose_enough_gift: "You've chosen enough rewards.",
            },
            gift_icon: {
                manual: "Please claim your reward.",
                auto: "You have just received a reward.",
            },
        },
        [this.POPUP_LAYOUT.GIFTS_ONLY]: {
            title: "Congratulations! Reward for you",
            subtitle: "A special gift is waiting for you. Claim it now before it’s gone!",
            free_text: "Free",
            add_to_cart_btn: "Add to cart",
            claim_btn: "Claim gift",
            dismiss_help_text: "Do not show this again",
        },
    };    

    #storeAccessToken;
    #rules;
    #displaySettings;
    #translation;

    constructor(
        isRestricted,
        template,
        shopFormatMoney,
        defaultImg,
        offerImg,
        updateState, 
        displaySettings,
        currentProductId,
        collectionOfProduct,
        productIdMapCollection,
        currentProductVariantIds,
        variantIdMapInventory,
        currentCustomer,
        translations
    ) {
        // Element
        this.iconPopupElement = document.querySelector(".salepify-fg-advanced-icon-popup");
        this.iconPopupBadgeElement = document.querySelector(".salepify-fg-advanced-icon-popup-badge");
        this.iconPopupBadgeTextElement = document.querySelector(".salepify-fg-advanced-icon-popup-badge__text");

        this.cartId = "";
        this.itemsInCart = new Map();
        //Data item in temp cart
        this.itemsInTempCart = new Map();
        this.giftsInTempCart = new Map();

        this.updateState = updateState ? updateState.advanced_free_gift : null;
        this.currentProductId = currentProductId;
        this.collectionOfProduct = collectionOfProduct;
        this.productIdMapCollection = new Map(productIdMapCollection);
        this.currentProductVariantIds = currentProductVariantIds;
        this.variantIdMapInventory = new Map(variantIdMapInventory);
        this.currentCustomer = currentCustomer;

        this.ruleIdMapData = new Map();
        this.blockedRuleId = new Set();
        // Store the id and price of list customer buy in cart
        this.ruleIdMapParentInCart = new Map();
        // Store the quantity of selected gift
        this.ruleIdMapSelectedGift = new Map();
        this.ruleIdMapGiftQtyInCart = new Map();
        this.ruleIdMapGiftAddedByApp = new Map();

        // Store the fetch status of the rule's data collection, 
        // including whether it is_loading, is_complete_loading, 
        // and the pagination information of the collections (has_next_page, end_cursor).
        this.ruleIdMapLoadingCollectionStatus = new Map();

        this.ruleIdMapCanClaimTime = new Map();
        this.ruleIdMapConditionState = new Map();
        this.ruleIdMapProductGifts = new Map();

        this.ruleIdMapTimeoutErr = new Map();

        // Data
        this.shopifyIdMapData = new Map();

        // Notification
        this.giftAddedImg = []

        //Template
        this.template = template;
        this.defaultImg = defaultImg;
        this.offerImg = offerImg;
        // Currency
        this.shopFormatMoney = shopFormatMoney;
        this.currencyRate = 1;
        if (Shopify && Shopify.currency) {
            this.currencyRate = Number(Shopify.currency.rate);
        }

        this.renderedRules = new Set();

        // Get display settings and translations
        this.#displaySettings = {
            layout: this.POPUP_LAYOUT.GIFTS_ONLY,
            ...this.DEFAULT_DISPLAY_SETTING[this.POPUP_LAYOUT.GIFTS_ONLY],
        };
        this.#translation = {
            default: this.DEFAULT_RULE_SPECIFIC_TRANSLATION[this.POPUP_LAYOUT.GIFTS_ONLY],
        };

        this.#rules = [];
        this.discountCodeMapRuleId = new Map();
        //Check is first loading in page
        this.firstLoading = true;

        //Check is auto open popup
        this.isAutoOpenPopup = false;
        this.initializeLocalStorage().then(async () => {
            if(this.#rules.length){
                await this.#getStoreAccess();
                tlAdvancedFreeGiftOverride();

                if (isRestricted) {
                    this.#rules.forEach(rule => {
                        const customTextDisplayData = JSON.parse(rule.custom_text_display);
                        rule.custom_text_display = JSON.stringify({
                            ...customTextDisplayData,
                            offer_title: {
                                default: customTextDisplayData.offer_title,
                            }
                        });
                    });
                }else {
                    const popupDisplaySettings = displaySettings?.popup_new;
                    if (popupDisplaySettings) {
                        this.#displaySettings = this.syncPopupStyling(popupDisplaySettings);
                    }

                    const locale = Shopify?.locale || "en";
                    const { layout } = this.#displaySettings;
                    const localeTranslation = translations?.popup_new?.[locale]?.[layout] 
                        ?? (layout === this.POPUP_LAYOUT.DETAILED_LIST ? translations?.popup_new?.[locale] ?? {} : {});
                    Object.keys(localeTranslation).forEach(key => {
                        localeTranslation[key] = {
                            ...this.DEFAULT_RULE_SPECIFIC_TRANSLATION[layout],
                            ...localeTranslation[key],
                        };
                    });
                    this.#translation = {
                        ...this.DEFAULT_GENERAL_TRANSLATION[layout],
                        ...localeTranslation,
                        default: this.DEFAULT_RULE_SPECIFIC_TRANSLATION[layout],
                    };
                }
                await this.updateCartData();
                this.applyStyle();

                // Define notification popup
                if(window.tlNotificationPopupClass){
                    window.tlNotificationPopup = window.tlNotificationPopup || 
                        new window.tlNotificationPopupClass(isRestricted, displaySettings, translations)
                }
                this.applyCustomCss();
                this.trackImpression();
            }else {
                await this.removeRemainingGift();
            }
        });
    }

    get rules() {
        return structuredClone(this.#rules);
    }
    get displaySettings() {
        return structuredClone(this.#displaySettings);
    }
    get translation() {
        return structuredClone(this.#translation);
    }

    applyCustomCss = () => {
        const customCss = this.displaySettings.custom_css;
        if(customCss && customCss.trim() !== ""){
            var styleElement = document.getElementById("tl_custom_css_popup_new");

            if (!styleElement) {
                styleElement = document.createElement("style");
                styleElement.id = "tl_custom_css_popup_new";
                document.head.appendChild(styleElement);
            }
    
            styleElement.innerHTML = customCss;
        }
    }

    initializeLocalStorage = async () => {
        const initialTime = (new Date()).getTime() + 24 * 3600 * 1000;
        let initialData = {
            updated_at: new Date().toISOString(),
            expiredTime: initialTime,
            rules: []
        }

        const tlAdvancedFGLocalStorage = localStorage.getItem(this.LOCAL_STORAGE);
        if(!tlAdvancedFGLocalStorage){
            initialData.rules = await this.getAllRule();
        }else {
            const tlAdvancedFGLocalStorageData = JSON.parse(tlAdvancedFGLocalStorage);
            const expiredTime = tlAdvancedFGLocalStorageData.expiredTime || 0;
            if ((new Date()).getTime() > expiredTime || tlAdvancedFGLocalStorageData.updated_at < this.updateState || !tlAdvancedFGLocalStorageData.updated_at) {
                initialData.rules = await this.getAllRule();
                initialData.updated_at = this.updateState;
                sessionStorage.removeItem(this.SESSION_STORAGE);
            }else {
                initialData = JSON.parse(JSON.stringify(tlAdvancedFGLocalStorageData));
                initialData.rules = tlAdvancedFGLocalStorageData.rules;
            }
        }

        this.#rules = await this.filterRule(initialData.rules);
        localStorage.setItem(this.LOCAL_STORAGE, JSON.stringify(initialData));
    }

    getAllRule = async () => {
        const getAllRuleReq = await fetch(window.Shopify.routes.root + `${this.PROXY_URL}/free-gift/advanced`);
        const getAllRuleRes = await getAllRuleReq.json();

        return getAllRuleRes.success ? getAllRuleRes.data : []
    }

    #getStoreAccess = async () => {
        const getShopAccessReq = await fetch(window.Shopify.routes.root + `${this.PROXY_URL}/shop`);
        const getShopAccessRes = await getShopAccessReq.json();

        this.#storeAccessToken = getShopAccessRes.data;
    }

    getCollectionData = async(nonGlobalId, endCursor) => {
        try {
            const getCollectionReq = await fetch(`https://${Shopify.shop}/api/${this.API_VERSION}/graphql.json`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-Shopify-Storefront-Access-Token": this.#storeAccessToken
                },
                body: JSON.stringify({
                    query: `query ($endCursor: String){
                        collection(id: "gid://shopify/Collection/${nonGlobalId}") {
                            products(first: ${this.ROW_PER_PAGE}, after: $endCursor) {
                                nodes {
                                    id
                                    title
                                    handle
                                    featuredImage{
                                        url
                                    }
                                    availableForSale
                                    variants(first: 100){
                                        nodes {
                                            id
                                            title
                                            availableForSale
                                            image {
                                                url
                                            }
                                            price {
                                                amount
                                                currencyCode
                                            }
                                        }
                                    }

                                }
                                pageInfo {
                                    hasNextPage
                                    endCursor
                                }
                            }
                        }
                    }`,
                    variables: {endCursor}
                })
            });

            const getCollectionRes = await getCollectionReq.json();

            return getCollectionRes.data;
        } catch (error) {
            console.log("Error when getCollectionData - Advanced Free Gift: ", error)
        }
    }

    getVariantData = async (nonGlobalId) => {
        const idBase64 = btoa(`gid://shopify/ProductVariant/${nonGlobalId}`);
        try {
            const getVariantReq = await fetch(`https://${Shopify.shop}/api/${this.API_VERSION}/graphql.json`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-Shopify-Storefront-Access-Token": this.#storeAccessToken
                },
                body: JSON.stringify({
                    query: ` query {
                        node(id: "${idBase64}") {
                            ... on ProductVariant {
                                id
                                price {
                                    amount
                                    currencyCode
                                }
                                product {
                                    id
                                    collections(first: 250){
                                        nodes {
                                            id
                                            handle
                                            title
                                        }
                                    }
                                }
                            }
                        }
                    }`
                })
            });
    
            const getVariantRes =  await getVariantReq.json();
            if(getVariantRes.data) {
                const listCollectionId = [];
                getVariantRes.data.node.product.collections.nodes.map(collection => {
                    listCollectionId.push(collection.id.split("/").pop());
                })

                const productId = getVariantRes.data.node.product.id.split("/").pop();
                this.productIdMapCollection.set(productId, listCollectionId);
                return getVariantRes.data.node;
            }else {
                return null;
            }
        } catch (error) {
            console.log("Error when getVariantData - Advanced Free Gift: ", error)
        }
    }

    compareRule(listRule) {
        listRule.sort((rule1, rule2) => {
            const date1 = new Date(rule1.created_at);
            const date2 = new Date(rule2.created_at);
            
            // Compare the dates
            return date2 - date1;
        });
        return listRule;
    }

    async checkAdvancedConditionBeforeUpdate(rule){
        //Check country target 
        if(rule.country_target_value.length){
            const ipInfoReq = await fetch('https://ipinfo.io/json');
            const ipInfoRes = await ipInfoReq.json();
            const contryTargetValue = rule.country_target_value.split(",");
            if(
                rule.country_target_type === this.COUNTRY_TARGET_TYPE.INCLUDE &&
                !contryTargetValue.includes(ipInfoRes.country)
            ){
                return false;
            }else if(
                rule.country_target_type === this.COUNTRY_TARGET_TYPE.EXCLUDE &&
                contryTargetValue.includes(ipInfoRes.country)
            ){
                return false;
            }
        }

        // Check customer target
        if(!this.currentCustomer){
            //Case: Customer is not logged and customer_target is not the case all or not_logged => false
            if(
                rule.customer_target !== this.CUSTOMER_TARGET.NOT_LOGGED &&
                rule.customer_target !== this.CUSTOMER_TARGET.ALL
            ){
                return false;
            }
        }else{
            if(rule.customer_target === this.CUSTOMER_TARGET.CUSTOMER_TAG){
                let isContainTag = false;
                const customerTags = this.currentCustomer.tags.map(tag => tag.toLocaleLowerCase());
                const customerTagetValue = rule.customer_target_value.split(",");
            
                for (let i = 0; i < customerTagetValue.length; i++) {
                    const tag = customerTagetValue[i];
                    if(customerTags.includes(tag.toLocaleLowerCase())){
                        isContainTag = true;
                        break;
                    }
                }   
                // Customer target to tag and not contain tag => false
                if(!isContainTag) return false
            }else if(
                rule.customer_target === this.CUSTOMER_TARGET.ORDER_COUNT &&
                (this.currentCustomer.orders_count < Number(rule.customer_target_value) ||
                (rule.customer_target_max_value && this.currentCustomer.orders_count > Number(rule.customer_target_max_value)))
            ){
                // Customer has order_count less than required
                return false;
            }else if(
                rule.customer_target === this.CUSTOMER_TARGET.TOTAL_SPENT &&
                (this.currentCustomer.total_spent < parseFloat(rule.customer_target_value) ||
                (rule.customer_target_max_value && this.currentCustomer.total_spent > parseFloat(rule.customer_target_max_value)))
            ){
                // Customer has total_spent less than required
                return false;
            }else if(
                rule.customer_target === this.CUSTOMER_TARGET.SPECIFIC_CUSTOMER &&
                !rule.customer_target_value.split(",").includes(String(this.currentCustomer.id))
            ){
                // Customer is not include in specific list
                return false;   
            }else if(rule.customer_target === this.CUSTOMER_TARGET.NOT_LOGGED){
                return false;
            }
        }

        return true;
    }

    filterRule = async (rules) => {
        const curenntDate = new Date().toISOString();

        const ruleFiltered = {
            all: [],
            collection: [],
            product: [],
            variant: [],
            tag: [],
        }
        for (let i = 0; i < rules.length; i++) {
            const rule = {
                ...rules[i],
                discount_type: rules[i].discount_type == this.DISCOUNT_TYPE.NO_DISCOUNT ? this.DISCOUNT_TYPE.PERCENTAGE : rules[i].discount_type,
                discount_value: rules[i].discount_type == this.DISCOUNT_TYPE.NO_DISCOUNT ? 100 : rules[i].discount_value
            };
            this.blockedRuleId.add(rule.id);
            this.discountCodeMapRuleId.set(rule.name, rule.id);
            this.ruleIdMapData.set(rule.id, rule);
            // Check rule is active and active date is valid 
            if(
                rule.active &&
                curenntDate >= rule.start_at &&
                (
                    (rule.end_at && curenntDate <= rule.end_at ) ||
                    !rule.end_at
                )
            ) {
                if(!rule.advanced_conditions){
                    const checked = await this.checkAdvancedConditionBeforeUpdate(rule);
                    if(!checked) continue;
                }else {
                    const advancedCondition = JSON.parse(rule.advanced_conditions);
                    const {
                        SPECIFIC_COUNTRY, CUSTOMER_TAG, SPECIFIC_CUSTOMER, 
                        CUSTOMER_STATUS, ORDER_COUNT, TOTAL_SPENT
                    } = this.ADVANCED_CONDITION;
                    // Specific country condition
                    if(advancedCondition[SPECIFIC_COUNTRY]){
                        const specifiCountry = advancedCondition[SPECIFIC_COUNTRY];
                        const ipInfoReq = await fetch('https://ipinfo.io/json');
                        const ipInfoRes = await ipInfoReq.json();

                        if(
                            specifiCountry.type === this.COUNTRY_TARGET_TYPE.INCLUDE &&
                            !specifiCountry.targetCountry.includes(ipInfoRes.country)
                        ){
                            continue;
                        }else if(
                            specifiCountry.type === this.COUNTRY_TARGET_TYPE.EXCLUDE &&
                            specifiCountry.targetCountry.includes(ipInfoRes.country)
                        ){
                            continue;
                        }
                    }

                    if(!this.currentCustomer){
                        if(advancedCondition[CUSTOMER_STATUS] !== this.CUSTOMER_STATUS.NOT_LOGGED){
                            if(
                                advancedCondition[SPECIFIC_CUSTOMER] || 
                                advancedCondition[CUSTOMER_TAG] ||
                                advancedCondition[ORDER_COUNT] ||
                                advancedCondition[TOTAL_SPENT] ||
                                advancedCondition[CUSTOMER_STATUS] == this.CUSTOMER_STATUS.LOGGED_IN
                            ){
                                continue;
                            }
                        }
                    }else {
                        if(advancedCondition[CUSTOMER_STATUS] !== this.CUSTOMER_STATUS.NOT_LOGGED){
                            // Specific customer condition
                            if(
                                advancedCondition[SPECIFIC_CUSTOMER] && 
                                !advancedCondition[SPECIFIC_CUSTOMER].includes(String(this.currentCustomer.id))
                            ) {
                                continue;
                            }

                            // Customer tag condition
                            if(advancedCondition[CUSTOMER_TAG]){
                                let isContainTag = false;
                                const customerTags = this.currentCustomer.tags.map(tag => tag.toLocaleLowerCase());
                                const customerTagetValue = advancedCondition[CUSTOMER_TAG];

                                for (let i = 0; i < customerTagetValue.length; i++) {
                                    const tag = customerTagetValue[i];
                                    if(customerTags.includes(tag.toLocaleLowerCase())){
                                        isContainTag = true;
                                        break;
                                    }
                                }   
                                // Customer target to tag and not contain tag => false
                                if(!isContainTag) continue
                            }
                            
                            // Order count condition 
                            if(advancedCondition[ORDER_COUNT]){
                                const { min_value, max_value } = advancedCondition[ORDER_COUNT];
                                if(
                                    (this.currentCustomer.orders_count < Number(min_value) ||
                                    (max_value && this.currentCustomer.orders_count > Number(max_value)))
                                ){ 
                                    continue 
                                }
                            }

                            // Total spent condition
                            if(advancedCondition[TOTAL_SPENT]){
                                const { min_value, max_value } = advancedCondition[TOTAL_SPENT];
                                if(
                                    (this.currentCustomer.total_spent < Number(min_value) ||
                                    (max_value && this.currentCustomer.total_spent > Number(max_value)))
                                ){
                                    continue
                                }
                            }
                        }else {
                            continue
                        }
                    }
                }

                ruleFiltered[rule.apply_to_product].push(rule);
                this.blockedRuleId.delete(rule.id);
            }
        }

        return [
            ...this.compareRule(ruleFiltered[this.APPLY_TO_PRODUCT.VARIANT]),
            ...this.compareRule(ruleFiltered[this.APPLY_TO_PRODUCT.PRODUCT]),
            ...this.compareRule(ruleFiltered[this.APPLY_TO_PRODUCT.COLLECTION]),
            ...this.compareRule(ruleFiltered[this.APPLY_TO_PRODUCT.TAG]),
            ...this.compareRule(ruleFiltered[this.APPLY_TO_PRODUCT.ALL]),
        ]
    }

    formatMoney = function (t, e = `${this.shopFormatMoney}`) {
        function n(t, e) {
            return void 0 === t ? e : t
        }

        function o(t, e, o, i) {
            if (e = n(e, 2), o = n(o, ","), i = n(i, "."), isNaN(t) || null == t) return 0;
            var r = (t = (t / 100).toFixed(e)).split(".");
            return r[0].replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1" + o) + (r[1] ? i + r[1] : "")
        }

        "string" == typeof t && (t = t.replace(".", ""));
        var i = "",
            r = /\{\{\s*(\w+)\s*\}\}/,
            a = e || this.money_format;
        switch (a.match(r)[1]) {
            case "amount":
                i = o(t, 2);
                break;
            case "amount_no_decimals":
                i = o(t, 0);
                break;
            case "amount_with_comma_separator":
                i = o(t, 2, ".", ",");
                break;
            case "amount_with_space_separator":
                i = o(t, 2, " ", ",");
                break;
            case "amount_with_period_and_space_separator":
                i = o(t, 2, " ", ".");
                break;
            case "amount_no_decimals_with_comma_separator":
                i = o(t, 0, ".", ",");
                break;
            case "amount_no_decimals_with_space_separator":
                i = o(t, 0, " ");
                break;
            case "amount_with_apostrophe_separator":
                i = o(t, 2, "'", ".")
        }
        return a.replace(r, i)
    }

    isJson(str) {
        try {
            JSON.parse(str);
        } catch (e) {
            return false;
        }
        return true;
    }

    deepMergeObject(a, b) {
        const result = { ...a };
    
        for (const key in b) {
            if (b.hasOwnProperty(key)) {
                if (a && typeof a[key] === 'object' && typeof b[key] === 'object' && !Array.isArray(a[key])) {
                    result[key] = this.deepMergeObject(a[key], b[key]); 
                } else if(b[key] !== undefined){
                    result[key] = b[key]; 
                }
            }
        }
    
        return result;
    };

    getFontFamily(fontFamily) {
        return fontFamily === "Store default" ? "inherit" : fontFamily;
    }

    syncPopupStyling = (displaySetting) => {
        const { selected_layout, layout_styles } = displaySetting;
    
        if (selected_layout) {
            return {
                layout: selected_layout,
                ...this.deepMergeObject(this.DEFAULT_DISPLAY_SETTING[selected_layout], layout_styles[selected_layout]),
            };
        }
    
        const {
            background_section: backgroundSection,
            main_section: mainSection,
            detail_section: detailSection,
            claim_btn: claimButton,
            icon_popup: iconPopup,
            animation,
            show_confetti_animation: showConfettiAnimation,
            position,
            custom_css: customCss,
        } = displaySetting;

        const {
            container: defaultContainerStyle,
            header: defaultHeaderStyle,
            main_section: defaultMainSectionStyle,
            product_item: defaultProductItemStyle,
            upsell_msg: defaultUpsellMsgStyle,
            add_btn: defaultAddBtnStyle,
            claim_btn: defaultClaimBtnStyle,
            icon_popup: defaultIconPopupStyle,
        } = this.DEFAULT_DISPLAY_SETTING[this.POPUP_LAYOUT.DETAILED_LIST];

        const layoutStyles = this.deepMergeObject(this.DEFAULT_DISPLAY_SETTING[this.POPUP_LAYOUT.DETAILED_LIST], {
            container: {
                background_color: backgroundSection.background_color ?? defaultContainerStyle.background_color,
            },
            header: {
                title: {
                    font_size: backgroundSection.header_title?.font_size ?? defaultHeaderStyle.title.font_size,
                },
                close_btn: {
                    color: backgroundSection.close_btn_color ?? defaultHeaderStyle.close_btn.color,
                },
            },
            main_section: {
                offer_title: {
                    font_size: mainSection.offer_title?.font_size ?? defaultMainSectionStyle.offer_title.font_size,
                    color: mainSection.offer_title?.color ?? defaultMainSectionStyle.offer_title.color,
                },
                toggle_button: {
                    font_size: mainSection.view_less?.font_size ?? defaultMainSectionStyle.toggle_button.font_size,
                    color: mainSection.view_less?.color ?? defaultMainSectionStyle.toggle_button.color,
                },
            },
            product_item: {
                title: {
                    color: detailSection.gift_item?.product_text_color ?? defaultProductItemStyle.title.color,
                },
                free_text: {
                    color: detailSection.gift_item?.free_text_color ?? defaultProductItemStyle.free_text.color,
                },
                price: {
                    color: detailSection.gift_item?.price_text_color ?? defaultProductItemStyle.price.color,
                },
            },
            upsell_msg: {
                font_size: mainSection.upsell_msg?.font_size ?? defaultUpsellMsgStyle.font_size,
                color: mainSection.upsell_msg?.color ?? defaultUpsellMsgStyle.color,
                background_color: mainSection.upsell_msg?.background_color ?? defaultUpsellMsgStyle.background_color,
                padding: mainSection.upsell_msg?.padding ?? defaultUpsellMsgStyle.padding,
            },
            add_btn: {
                icon_color: detailSection.gift_selector?.color ?? defaultAddBtnStyle.icon_color,
            },
            claim_btn: {
                font_size: claimButton.font_size ?? defaultClaimBtnStyle.font_size,
                font_weight: claimButton.font_weight ?? defaultClaimBtnStyle.font_weight,
                color: claimButton.color ?? defaultClaimBtnStyle.color,
                background_color: claimButton.background_color ?? defaultClaimBtnStyle.background_color,
                padding: claimButton.padding ?? defaultClaimBtnStyle.padding,
                selected_text: {
                    color: detailSection.selected_text?.color ?? defaultClaimBtnStyle.selected_text.color,
                },
            },
            icon_popup: {
                is_icon_displayed: iconPopup.is_icon_displayed ?? defaultIconPopupStyle.is_icon_displayed,
                position: position ?? defaultIconPopupStyle.position,
                color: iconPopup.color ?? defaultIconPopupStyle.color,
                icon_color: iconPopup.icon_color ?? defaultIconPopupStyle.icon_color,
                icon_size: iconPopup.icon_size ?? defaultIconPopupStyle.icon_size,
                background_color: iconPopup.background_color ?? defaultIconPopupStyle.background_color,
                border_color: iconPopup.border_color ?? defaultIconPopupStyle.border_color,
                border_radius: iconPopup.border_radius ?? defaultIconPopupStyle.border_radius,
                border_width: iconPopup.border_width ?? defaultIconPopupStyle.border_width,
                adv_free_gift_image: iconPopup.adv_free_gift_image ?? defaultIconPopupStyle.adv_free_gift_image,
            },
            animation: {
                popup_transition: animation,
                show_confetti: showConfettiAnimation,
            },
            customCss,
        });
    
        return {
            layout: this.POPUP_LAYOUT.DETAILED_LIST,
            ...layoutStyles,
        };
    };    
    
    convertHexToRGBA (hexColor,alpha){
        let hex = hexColor.replace(/^#/, '');
        if (hex.length === 3) {
            hex = hex
                .split('')
                .map((char) => char + char)
                .join('');
        }
        const red = parseInt(hex.substring(0, 2), 16);
        const green = parseInt(hex.substring(2, 4), 16);
        const blue = parseInt(hex.substring(4, 6), 16);
        if(alpha === undefined || alpha === null){
            alpha = 1
        }
        const roundedAlpha = Math.round(alpha * 100) / 100;
        return `rgba(${red}, ${green}, ${blue}, ${roundedAlpha})`;
    }

    applyStyle = () => {
        const { layout } = this.#displaySettings;

        // Set container styles
        const containerStyle = this.#displaySettings.container;
        document.documentElement.style.setProperty('--salepify-fg-advanced-container-border-radius', `${containerStyle.border_radius}px`);
        document.documentElement.style.setProperty('--salepify-fg-advanced-container-border-width', `${containerStyle.border_width}px`);
        document.documentElement.style.setProperty('--salepify-fg-advanced-container-border-color', containerStyle.border_color);
        document.documentElement.style.setProperty('--salepify-fg-advanced-container-background-color', containerStyle.background_color);
        document.documentElement.style.setProperty('--salepify-fg-advanced-container-font-family', this.getFontFamily(containerStyle.font_family));

        // Set header styles
        const headerStyle = this.#displaySettings.header;
        if (layout === this.POPUP_LAYOUT.GIFTS_ONLY) {
            document.documentElement.style.setProperty('--salepify-fg-advanced-header-background-color', headerStyle.background_color);
            document.documentElement.style.setProperty('--salepify-fg-advanced-header-padding', `${headerStyle.padding}px`);
        }
        document.documentElement.style.setProperty('--salepify-fg-advanced-header-title-font-size', `${headerStyle.title.font_size}px`);
        document.documentElement.style.setProperty('--salepify-fg-advanced-header-title-font-weight', `${headerStyle.title.font_weight}`);
        document.documentElement.style.setProperty('--salepify-fg-advanced-header-title-color', headerStyle.title.color);
        document.documentElement.style.setProperty('--salepify-fg-advanced-header-subtitle-font-size', `${headerStyle.subtitle.font_size}px`);
        document.documentElement.style.setProperty('--salepify-fg-advanced-header-subtitle-font-weight', `${headerStyle.subtitle.font_weight}`);
        document.documentElement.style.setProperty('--salepify-fg-advanced-header-subtitle-color', headerStyle.subtitle.color);
        document.documentElement.style.setProperty('--salepify-fg-advanced-header-alignment', headerStyle.alignment);
        document.documentElement.style.setProperty('--salepify-fg-advanced-header-close-btn-color', headerStyle.close_btn.color);

        // Set product block styles
        const productBlockStyle = this.#displaySettings.product_block;
        document.documentElement.style.setProperty('--salepify-fg-advanced-product-block-border-radius', `${productBlockStyle.border_radius}px`);
        document.documentElement.style.setProperty('--salepify-fg-advanced-product-block-border-width', `${productBlockStyle.border_width}px`);
        document.documentElement.style.setProperty('--salepify-fg-advanced-product-block-border-color', productBlockStyle.border_color);
        document.documentElement.style.setProperty('--salepify-fg-advanced-product-block-background-color', productBlockStyle.background_color);
        if (layout === this.POPUP_LAYOUT.DETAILED_LIST) {
            document.documentElement.style.setProperty('--salepify-fg-advanced-product-block-eligible-border-color', productBlockStyle.eligible.border_color);
            document.documentElement.style.setProperty('--salepify-fg-advanced-product-block-eligible-background-color', this.convertHexToRGBA(productBlockStyle.eligible.background_color,0.15));
        }
        document.documentElement.style.setProperty('--salepify-fg-advanced-product-block-padding-top', `${productBlockStyle.padding.top}px`);
        document.documentElement.style.setProperty('--salepify-fg-advanced-product-block-padding-right', `${productBlockStyle.padding.right}px`);
        document.documentElement.style.setProperty('--salepify-fg-advanced-product-block-padding-bottom', `${productBlockStyle.padding.bottom}px`);
        document.documentElement.style.setProperty('--salepify-fg-advanced-product-block-padding-left', `${productBlockStyle.padding.left}px`);
        document.documentElement.style.setProperty('--salepify-fg-advanced-product-block-gap', `${productBlockStyle.gap}px`);

        if (layout === this.POPUP_LAYOUT.DETAILED_LIST) {
            // Set main section styles
            const mainSectionStyle = this.#displaySettings.main_section;
            document.documentElement.style.setProperty('--salepify-fg-advanced-main-section-offer-title-font-size', `${mainSectionStyle.offer_title.font_size}px`);
            document.documentElement.style.setProperty('--salepify-fg-advanced-main-section-offer-title-font-weight', mainSectionStyle.offer_title.font_weight);
            document.documentElement.style.setProperty('--salepify-fg-advanced-main-section-offer-title-color', mainSectionStyle.offer_title.color);
            document.documentElement.style.setProperty('--salepify-fg-advanced-main-section-toggle-button-font-size', `${mainSectionStyle.toggle_button.font_size}px`);
            document.documentElement.style.setProperty('--salepify-fg-advanced-main-section-toggle-button-font-weight', `${mainSectionStyle.toggle_button.font_weight}`);
            document.documentElement.style.setProperty('--salepify-fg-advanced-main-section-toggle-button-color', this.convertHexToRGBA(mainSectionStyle.toggle_button.color,mainSectionStyle.toggle_button.opacity));
        }

        // Set product image styles
        const productImageStyle = this.#displaySettings.product_image;
        document.documentElement.style.setProperty('--salepify-fg-advanced-product-image-border-radius', `${productImageStyle.border_radius}px`);
        document.documentElement.style.setProperty('--salepify-fg-advanced-product-image-border-color', productImageStyle.border_color);

        // Set product item styles
        const productItemStyle = this.#displaySettings.product_item;
        document.documentElement.style.setProperty('--salepify-fg-advanced-product-item-title-font-size', `${productItemStyle.title.font_size}px`);
        document.documentElement.style.setProperty('--salepify-fg-advanced-product-item-title-font-weight', `${productItemStyle.title.font_weight}`);
        document.documentElement.style.setProperty('--salepify-fg-advanced-product-item-title-color', productItemStyle.title.color);
        document.documentElement.style.setProperty('--salepify-fg-advanced-product-item-free-text-font-size', `${productItemStyle.free_text.font_size}px`);
        document.documentElement.style.setProperty('--salepify-fg-advanced-product-item-free-text-font-weight', `${productItemStyle.free_text.font_weight}`);
        document.documentElement.style.setProperty('--salepify-fg-advanced-product-item-free-text-color', productItemStyle.free_text.color);
        document.documentElement.style.setProperty('--salepify-fg-advanced-product-item-price-font-size', `${productItemStyle.price.font_size}px`);
        document.documentElement.style.setProperty('--salepify-fg-advanced-product-item-price-font-weight', `${productItemStyle.price.font_weight}`);
        document.documentElement.style.setProperty('--salepify-fg-advanced-product-item-price-color', productItemStyle.price.color);
        document.documentElement.style.setProperty('--salepify-fg-advanced-product-item-gap', `${productItemStyle.gap}px`);

        if (layout === this.POPUP_LAYOUT.DETAILED_LIST) {
            // Set upsell message styles
            const upsellMsgStyle = this.#displaySettings.upsell_msg;
            document.documentElement.style.setProperty('--salepify-fg-advanced-upsell-msg-font-size', `${upsellMsgStyle.font_size}px`);
            document.documentElement.style.setProperty('--salepify-fg-advanced-upsell-msg-font-weight', `${upsellMsgStyle.font_weight}`);
            document.documentElement.style.setProperty('--salepify-fg-advanced-upsell-msg-color', upsellMsgStyle.color);
            document.documentElement.style.setProperty('--salepify-fg-advanced-upsell-msg-background-color', this.convertHexToRGBA(upsellMsgStyle.background_color, upsellMsgStyle.opacity));
            document.documentElement.style.setProperty('--salepify-fg-advanced-upsell-msg-padding', `${upsellMsgStyle.padding}px`);
        }

        // Set add button styles
        const addBtnStyle = this.#displaySettings.add_btn;
        if (layout === this.POPUP_LAYOUT.DETAILED_LIST) {
            document.documentElement.style.setProperty("--salepify-fg-advanced-add-btn-icon-color", addBtnStyle.icon_color);
        }
        if (layout === this.POPUP_LAYOUT.GIFTS_ONLY) {
            document.documentElement.style.setProperty('--salepify-fg-advanced-add-btn-font-size', `${addBtnStyle.font_size}px`);
            document.documentElement.style.setProperty('--salepify-fg-advanced-add-btn-font-weight', `${addBtnStyle.font_weight}`);
            document.documentElement.style.setProperty('--salepify-fg-advanced-add-btn-color', addBtnStyle.color);
        }
        document.documentElement.style.setProperty('--salepify-fg-advanced-add-btn-background-color', this.convertHexToRGBA(addBtnStyle.background_color, addBtnStyle.opacity));

        // Set claim button styles
        const claimBtnStyle = this.#displaySettings.claim_btn;
        document.documentElement.style.setProperty('--salepify-fg-advanced-claim-btn-font-size', `${claimBtnStyle.font_size}px`);
        document.documentElement.style.setProperty('--salepify-fg-advanced-claim-btn-font-weight', `${claimBtnStyle.font_weight}`);
        document.documentElement.style.setProperty('--salepify-fg-advanced-claim-btn-color', claimBtnStyle.color);
        document.documentElement.style.setProperty('--salepify-fg-advanced-claim-btn-background-color', this.convertHexToRGBA(claimBtnStyle.background_color, claimBtnStyle.opacity));
        document.documentElement.style.setProperty('--salepify-fg-advanced-claim-btn-padding', `${claimBtnStyle.padding}px`);
        if (layout === this.POPUP_LAYOUT.DETAILED_LIST) {
            document.documentElement.style.setProperty('--salepify-fg-advanced-claim-btn-selected-text-color', this.convertHexToRGBA(claimBtnStyle.selected_text.color, claimBtnStyle.selected_text.opacity));
        }

        if (layout === this.POPUP_LAYOUT.DETAILED_LIST) {
            // Set popup icon styles
            if (this.#displaySettings.icon_popup.position === this.POSITION_OF_POPUP.BOTTOM_RIGHT) {   
                this.iconPopupElement.style.bottom = "10px";
                this.iconPopupElement.style.right = "10px";
                this.iconPopupBadgeTextElement.style.left = "-180px";
                this.iconPopupBadgeTextElement.style.right = "unset";
            } else if (this.#displaySettings.icon_popup.position === this.POSITION_OF_POPUP.BOTTOM_LEFT) {   
                this.iconPopupElement.style.bottom = "10px";
                this.iconPopupElement.style.left = "10px";
                this.iconPopupBadgeTextElement.style.left = "unset";
                this.iconPopupBadgeTextElement.style.right = "-180px";
            } else if (this.#displaySettings.icon_popup.position === this.POSITION_OF_POPUP.CENTER_LEFT) {   
                this.iconPopupElement.style.top = "calc(50% - 35px)";
                this.iconPopupElement.style.left = "10px";
                this.iconPopupBadgeTextElement.style.left = "unset";
                this.iconPopupBadgeTextElement.style.right = "-180px";
            } else if (this.#displaySettings.icon_popup.position === this.POSITION_OF_POPUP.CENTER_RIGHT) {   
                this.iconPopupElement.style.top = "calc(50% - 35px)";
                this.iconPopupElement.style.right = "10px";
                this.iconPopupBadgeTextElement.style.left = "-180px";
                this.iconPopupBadgeTextElement.style.right = "unset";
            }
    
            const iconPopupStyle = this.#displaySettings.icon_popup;
            document.documentElement.style.setProperty('--salepify-fg-advanced-icon-popup-color', iconPopupStyle.color);
            document.documentElement.style.setProperty('--salepify-fg-advanced-icon-popup-icon-color',  this.convertHexToRGBA(iconPopupStyle.icon_color, iconPopupStyle.opacity));
            document.documentElement.style.setProperty('--salepify-fg-advanced-icon-popup-icon-size', `${iconPopupStyle.icon_size}px`);
            document.documentElement.style.setProperty('--salepify-fg-advanced-icon-popup-background-color', iconPopupStyle.background_color);
            document.documentElement.style.setProperty('--salepify-fg-advanced-icon-popup-border-color', iconPopupStyle.border_color);
            document.documentElement.style.setProperty('--salepify-fg-advanced-icon-popup-border-radius', `${iconPopupStyle.border_radius}px`);
            document.documentElement.style.setProperty('--salepify-fg-advanced-icon-popup-border-width', `${iconPopupStyle.border_width}px`);
        }

        // Set animation 
        if (this.#displaySettings.animation.popup_transition === this.POPUP_ANIMATION.FADE_IN) {
            document.documentElement.style.setProperty('--salepify-fg-advanced-show-transform', "none");
            document.documentElement.style.setProperty('--salepify-fg-advanced-hide-transform', "none"); 
        } else if (this.#displaySettings.animation.popup_transition === this.POPUP_ANIMATION.SLIDE_IN_UP) {
            document.documentElement.style.setProperty('--salepify-fg-advanced-show-transform', "translate3d(0, 0, 0))");
            document.documentElement.style.setProperty('--salepify-fg-advanced-hide-transform', "translate3d(0, -50px, 0)"); 
        } else if (this.#displaySettings.animation.popup_transition === this.POPUP_ANIMATION.SLIDE_IN_DOWN) {
            document.documentElement.style.setProperty('--salepify-fg-advanced-show-transform', "translate3d(0, 0, 0))");
            document.documentElement.style.setProperty('--salepify-fg-advanced-hide-transform', "translate3d(0, 50px, 0)"); 
        } else if (this.#displaySettings.animation.popup_transition === this.POPUP_ANIMATION.SLIDE_IN_LEFT) {
            document.documentElement.style.setProperty('--salepify-fg-advanced-show-transform', "translate3d(0, 0, 0))");
            document.documentElement.style.setProperty('--salepify-fg-advanced-hide-transform', "translate3d(50px, 0, 0)");
        } else if (this.#displaySettings.animation.popup_transition === this.POPUP_ANIMATION.SLIDE_IN_RIGHT) {
            document.documentElement.style.setProperty('--salepify-fg-advanced-show-transform', "translate3d(0, 0, 0))");
            document.documentElement.style.setProperty('--salepify-fg-advanced-hide-transform', "translate3d(-50px, 0, 0)"); 
        } else if (this.#displaySettings.animation.popup_transition === this.POPUP_ANIMATION.ZOOM_IN) {
            document.documentElement.style.setProperty('--salepify-fg-advanced-show-transform', "scale(1, 1)");
            document.documentElement.style.setProperty('--salepify-fg-advanced-hide-transform', "scale(0.3, 0.3)");
        }
    }

    trackImpression() {
        window.sessionStorage.setItem(this.IMPRESSION_KEY, 0);
        window.addEventListener('beforeunload', () => {
            const offer_ids = this.#rules.map(rule => rule.id);
            let date = new Date();
                date.setHours(0, 0, 0, 0);
                date = Math.floor(date.getTime() / 1000)

            const count = window.sessionStorage.getItem(this.IMPRESSION_KEY) 
                ? Number(window.sessionStorage.getItem(this.IMPRESSION_KEY)) : 0;
            if(count == 0) return;

            fetch(window.Shopify.routes.root + `${this.PROXY_URL}/impressions`, {
                method: 'POST',
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({
                    count,
                    module: "popup",
                    date,
                    offer_ids
                })
            })
        });
    }

    increaseImpression() {
        const count = window.sessionStorage.getItem(this.IMPRESSION_KEY) 
            ? Number(window.sessionStorage.getItem(this.IMPRESSION_KEY)) : 0;

        window.sessionStorage.setItem(this.IMPRESSION_KEY, count + 1);
    }

    getRuleTranslation = (ruleId) => {
        return this.#translation[ruleId] || this.#translation.default;
    }

    handleToggle = (e) => {
        if(e && !e.target.classList.contains("salepify-fg-advanced-wrapper")) return;
        const modalWrapper = document.querySelector(".salepify-fg-advanced-wrapper");
        const modal = document.querySelector(".salepify-fg-advanced");
        if(modal.classList.contains("salepify-fg-advanced--hide")){
            this.increaseImpression();
            modal.classList.add("salepify-fg-advanced--show");
            modal.classList.remove("salepify-fg-advanced--hide");
            modalWrapper.style.visibility = "visible";
        }else {
            modal.classList.add("salepify-fg-advanced--hide");
            modal.classList.remove("salepify-fg-advanced--show");
            modalWrapper.style.visibility = "hidden";
        }

        // NOTE
        if (this.#displaySettings.layout === this.POPUP_LAYOUT.GIFTS_ONLY) {
            this.render();
        }
    }

    openGiftModal = () => {
        this.increaseImpression();
        const modalWrapper = document.querySelector(".salepify-fg-advanced-wrapper");
        const modal = document.querySelector(".salepify-fg-advanced");
        modal.classList.add("salepify-fg-advanced--show");
        modal.classList.remove("salepify-fg-advanced--hide");
        modalWrapper.style.visibility = "visible";
    }

    stringIsJson = (str) => {
        try {
            JSON.parse(str);
        } catch (e) {
            return false;
        }
        return true;
    }

    parseShowOnPagesString = (showOnPagesString) => {
        if (this.stringIsJson(showOnPagesString)) {
            return JSON.parse(showOnPagesString);
        }
    
        const showOnPages = {
            [this.SHOW_ON_PAGES.ALL]: false,
            [this.SHOW_ON_PAGES.PRODUCT]: false,
            [this.SHOW_ON_PAGES.HOME]: false,
            [this.SHOW_ON_PAGES.COLLECTION]: false,
            [this.SHOW_ON_PAGES.CART]: false,
            [this.SHOW_ON_PAGES.SPECIFIC]: []
        };
    
        if (showOnPagesString === "") {
            showOnPages[this.SHOW_ON_PAGES.ALL] = true;
            return showOnPages;
        }
    
        showOnPagesString.split(",").forEach(page => {
            showOnPages[page] = true;
        });
        return showOnPages;
    }

    checkShowOnPage = (show_on_pages) => {
        const showOnPages = this.parseShowOnPagesString(show_on_pages);
        if (showOnPages[this.SHOW_ON_PAGES.ALL]) {
            return true;
        } else if (showOnPages[this.SHOW_ON_PAGES.HOME] && this.template === "index") {
            return true;
        } else if (showOnPages[this.SHOW_ON_PAGES.COLLECTION] && this.template === "collection") {
            return true;
        } else if (showOnPages[this.SHOW_ON_PAGES.PRODUCT] && this.template === "product") {
            return true;
        } else if (showOnPages[this.SHOW_ON_PAGES.CART] && this.template === "cart") {
            return true;
        } else if (showOnPages[this.SHOW_ON_PAGES.SPECIFIC].some((url) => url === window.location.href.replace(/\/$/, '').split('#')[0].split('?')[0])) {
            return true;
        } else {
            return false;
        }
    };

    getPriceAfterDiscount = (rule, price) => {
        const {
            discount_type: discountType,
            discount_value: discountValue 
        } = rule
        
        if(discountType == this.DISCOUNT_TYPE.PERCENTAGE){
            price -= price * discountValue / 100; 
        }else if(discountType == this.DISCOUNT_TYPE.FIXED){
            price -= discountValue * this.currencyRate;
        }else if(price > discountValue * this.currencyRate){
            price = discountValue * this.currencyRate;
        }

        return price > 0 ? price : 0
    }

    updateProductData = async (uniqueProductHandle) => {
        if(uniqueProductHandle.length){
            const getFirstProduct = await fetch(window.Shopify.routes.root + `products/${uniqueProductHandle[0]}.js`);
            const routes = getFirstProduct.ok ? window.Shopify.routes.root : "/";
            const productDataReq = await Promise.all(uniqueProductHandle.map(handle => fetch(routes + `products/${handle}.js`)))
            const productDataRes = await Promise.all(productDataReq.map(req => {
                if(req.ok){
                   return req.json();
                }
                return null;
            }));
    
            const validProducts = productDataRes.filter(product => product !== null);

            validProducts.map((product) => {
                const productId = String(product.id);
                const productImage = product.images[0] ? `https:${product.images[0]}` : this.defaultImg;
                const variants = product.variants.map(variant => {
                    const variantId = String(variant.id);

                    this.shopifyIdMapData.set(variantId, {
                        id: variantId,
                        title: variant.name,
                        handle: product.handle,
                        image: variant.featured_image ? variant.featured_image.src : productImage,
                        price: variant.price / 100,
                        available: variant.available,
                        productId: productId
                    })

                    return variantId;
                })

                this.shopifyIdMapData.set(productId, {
                    id: productId,
                    title: product.title,
                    handle: product.handle,
                    image: productImage,
                    price: product.price / 100,
                    available: product.available,
                    tags: product.tags,
                    variants: variants
                });
            })
        }
    }

    decodeHtml = (html) => {
        const txt = document.createElement('textarea');
        txt.innerHTML = html;
        return txt.value;
    }

    extractNumberFromString = (str) => {
        const regex = /(\d+)/;
        const match = str.match(regex);
        
        if (match) {
          return parseInt(match[0]);
        } else {
          return NaN;
        }
    }

    replaceVariable = (originalString, variable, value) => {
        return originalString.split(variable).join(value);
    }

    handleReplaceVariable = (rule, currentString, remain, remainSpecific, giftNumber) => {
        let remainValue = remain
        if(rule.apply_condition_type === this.APPLY_CONDITION_TYPE.AMOUNT){
            remainValue = this.formatMoney(remain * 100);
        }

        if(remain <= 0){
            remainValue = remainSpecific
        }
        currentString = this.replaceVariable(currentString, "{{gift_number}}", String(giftNumber));
        currentString = this.replaceVariable(currentString, "{{remain}}", String(remainValue));

        return currentString;
    }

    convertHandleToTitle(str) {
        return str
            .replace('-', ' ')             // Replace hyphen with space
            .replace(/^\w/, c => c.toUpperCase()); // Capitalize the first letter of the string
    }

    getOfferTitle = (rule) => {
        const locale = Shopify?.locale || "en";
        const customOfferTitle = JSON.parse(rule.custom_text_display).offer_title;
        let offerTitle = this.#translation[rule.id] 
            ? this.#translation[rule.id].main_offer.offer_title
            : (customOfferTitle[locale] ? customOfferTitle[locale] : (customOfferTitle.default || customOfferTitle))
        
        let listVariableInStr = [];
        const applyTo = rule.apply_to_product;
        const shopDomain = window.Shopify.shop;
        const parents = rule.listParents;
        if(applyTo == this.APPLY_TO_PRODUCT.COLLECTION){
            listVariableInStr = Array.from(new Set(offerTitle.match(/{{collection_\d+}}/gm)));

            listVariableInStr.map((variable) => {
                const collectionIndex = this.extractNumberFromString(variable) - 1;
                const collectionData = parents[collectionIndex];
 
                offerTitle = this.replaceVariable(
                    offerTitle, variable, 
                    `<a href="https://${shopDomain}/collections/${collectionData.handle}" target="_blank">${collectionData.title ? collectionData.title : this.convertHandleToTitle(collectionData.handle)}</a>`)
            })

        }else if(applyTo == this.APPLY_TO_PRODUCT.PRODUCT){
            listVariableInStr = Array.from(new Set(offerTitle.match(/{{product_\d+}}/gm)));

            listVariableInStr.map((variable) => {
                const productIndex = this.extractNumberFromString(variable) - 1;
                const productId = parents[productIndex].shopify_id;
                const productData = this.shopifyIdMapData.get(productId);
                
                offerTitle = this.replaceVariable(offerTitle, variable, `<a href="https://${shopDomain}/products/${productData.handle}" target="_blank">${productData.title}</a>`)
            })
        }else if(applyTo == this.APPLY_TO_PRODUCT.VARIANT){
            listVariableInStr = Array.from(new Set(offerTitle.match(/{{variant_\d+}}/gm)));

            listVariableInStr.map((variable) => {
                const variantIndex = this.extractNumberFromString(variable) - 1;
                const variantId = parents[variantIndex].shopify_id;
                const variantData = this.shopifyIdMapData.get(variantId);
                
                offerTitle = this.replaceVariable(offerTitle, variable, `<a href="https://${shopDomain}/products/${variantData.handle}?variant=${variantId}" target="_blank">${variantData.title}</a>`)
            })
        }else if(applyTo === this.APPLY_TO_PRODUCT.TAG){
            const tagCollection = JSON.parse(rule.tag_collection);

            offerTitle = this.replaceVariable(offerTitle, '{{product_with_selected_tag}}', `<a href="https://${shopDomain}/collections/${tagCollection.handle}" target="_blank">from the following list</a>`)
        }

        return offerTitle;
    }

    handleViewMore = (ruleId) => {
        const mainSection = document.querySelector(`#salepify-fg-advanced-main-section-${ruleId}`);
        const toggleBtn = mainSection.querySelector(".salepify-fg-advanced-main-section__view-offer-btn");
        const ruleTranslation = this.getRuleTranslation(ruleId);
    
        const isExpanded = mainSection.classList.toggle("salepify-fg-advanced-main-section--view-more");
        
        mainSection.classList.toggle("salepify-fg-advanced-main-section--view-less", !isExpanded);
        toggleBtn.innerHTML = isExpanded 
            ? ruleTranslation.main_offer.view_less 
            : ruleTranslation.main_offer.view_more;
    };
    

    showIconPopUpMessage = (message, availableToClaim) => {
        this.iconPopupBadgeTextElement.innerHTML = message;
        this.iconPopupBadgeElement.style = "display: block";

        this.iconPopupBadgeElement.querySelector("p").innerHTML = availableToClaim
        this.iconPopupElement.style.animation = "tlAdvancedFGShake 1s 2"
    }

    showError(ruleId, message) {
        const errorElement = document.querySelector(`div[id^="salepify-fg-advanced-error-${ruleId}"]`);

        errorElement.style = "display: flex;";
        errorElement.querySelector(".salepify-fg-advanced-error__message").innerHTML = message;
        this.setErrTimeOut(ruleId)
    }

    setErrTimeOut(ruleId, times = 3000) {
        const currentTimeout = this.ruleIdMapTimeoutErr.get(ruleId);
        if (currentTimeout) {
            clearTimeout(currentTimeout)
        }

        this.ruleIdMapTimeoutErr.set(ruleId, setTimeout(() => {
            const errorElement = document.querySelector(`div[id^="salepify-fg-advanced-error-${ruleId}"]`);
            errorElement.style = "display: none;";
            this.ruleIdMapTimeoutErr.set(ruleId, null)
        }, times))
    }

    getTotalSelectedGift = (ruleId) => {
        const giftSelectedMapQty = this.ruleIdMapSelectedGift.get(ruleId) ?  this.ruleIdMapSelectedGift.get(ruleId) : {};

        return Object.values(giftSelectedMapQty).reduce((acc, value) => acc + value, 0) ;
    }

    changeSelectorInputValue = (ruleId, giftId, value) => {        
        const isGiftsOnlyLayout = this.#displaySettings.layout === this.POPUP_LAYOUT.GIFTS_ONLY;
    
        const currentGiftElement = document.querySelector(`#salepify-fg-advanced-gift-${ruleId}-${giftId}`);
    
        const qtyInputElement = currentGiftElement.querySelector(".salepify-fg-advanced-gift-qty-selector__quantity");
        qtyInputElement.value = value;

        const comparePriceElement = currentGiftElement.querySelector(".salepify-fg-advanced-gift-description__price--compare");
        comparePriceElement.innerHTML = this.formatMoney(this.shopifyIdMapData.get(giftId).price * 100 * value);
    
        const remainGiftSelector = isGiftsOnlyLayout
            ? `#salepify-fg-advanced__main-section-container-${ruleId} .salepify-fg-advanced__claim-button`
            : `#salepify-fg-advanced-main-section-${ruleId} .salepify-fg-advanced-footer__remain-gift-title`;
    
        const remainGiftElement = document.querySelector(remainGiftSelector);
        const giftNumber = isGiftsOnlyLayout
            ? remainGiftElement.innerText.split("/")[1]?.replace(")", "")
            : remainGiftElement.innerText.split("/").pop();
    
        remainGiftElement.innerHTML = isGiftsOnlyLayout
            ? `${this.getRuleTranslation(ruleId).claim_btn} (${this.getTotalSelectedGift(ruleId)}/${giftNumber})`
            : `${this.getRuleTranslation(ruleId).manual_choose_gift.selected_text} ${this.getTotalSelectedGift(ruleId)}/${giftNumber}`;
    };    

    handleChangCheckBox = (e, ruleId, giftId) => {
        const giftQuantity = this.ruleIdMapData.get(ruleId).gift_qty * this.ruleIdMapCanClaimTime.get(ruleId);
        const giftSelectedMapQty = this.ruleIdMapSelectedGift.get(ruleId) ? 
            this.ruleIdMapSelectedGift.get(ruleId) : {};
        const currentGiftElement = document.querySelector(`#salepify-fg-advanced-gift-${ruleId}-${giftId}`);

        if (e.checked) {
            const totalSelectedGift = this.getTotalSelectedGift(ruleId);
            if (totalSelectedGift < giftQuantity) {
                giftSelectedMapQty[giftId] = 1;
                currentGiftElement.querySelector(".salepify-fg-advanced-gift-qty-selector").style = "display: flex !important;";

                if (this.#displaySettings.layout === this.POPUP_LAYOUT.GIFTS_ONLY) {
                    currentGiftElement.querySelector(`.salepify-fg-advanced-checkbox`).style = "display: none;";
                }
            } else {
                e.checked = false;
            }
        } else {
            delete giftSelectedMapQty[giftId];
            currentGiftElement.querySelector(".salepify-fg-advanced-gift-qty-selector").style = "display: none !important;";
        }

        this.ruleIdMapSelectedGift.set(ruleId, giftSelectedMapQty);
        this.changeSelectorInputValue(ruleId, giftId, 1)
    }

    increaseGiftQuantity(ruleId, giftId) {
        const giftQuantity = this.ruleIdMapData.get(ruleId).gift_qty * this.ruleIdMapCanClaimTime.get(ruleId);
        const giftSelectedMapQty = this.ruleIdMapSelectedGift.get(ruleId);
        const totalSelectedGift = this.getTotalSelectedGift(ruleId);
        if (totalSelectedGift < giftQuantity) {
            const newValue = giftSelectedMapQty[giftId] + 1;
            giftSelectedMapQty[giftId] = newValue;
            this.ruleIdMapSelectedGift.set(ruleId, giftSelectedMapQty);
            this.changeSelectorInputValue(ruleId, giftId, newValue);
        } else {
            const ruleTranslation = this.getRuleTranslation(ruleId);
            this.showError(ruleId, ruleTranslation.manual_choose_gift?.choose_enough_gift || "You've chosen enough rewards.");
        }
    }

    decreaseGiftQuantity(ruleId, giftId) {
        const giftSelectedMapQty = this.ruleIdMapSelectedGift.get(ruleId);
        const currentValue = giftSelectedMapQty[giftId];
    
        if (this.#displaySettings.layout === this.POPUP_LAYOUT.GIFTS_ONLY && currentValue <= 1) {
            delete giftSelectedMapQty[giftId];
    
            const currentGiftElement = document.querySelector(`#salepify-fg-advanced-gift-${ruleId}-${giftId}`);
            currentGiftElement.querySelector(".salepify-fg-advanced__gift-quantity.salepify-fg-advanced-gift-qty-selector").style = "display: none !important;";
            currentGiftElement.querySelector(`.salepify-fg-advanced-checkbox`).style = "display: block; width: auto; height: auto;";
    
            this.changeSelectorInputValue(ruleId, giftId, 1)
        } else {
            giftSelectedMapQty[giftId] = Math.max(currentValue - 1, 1);

            this.changeSelectorInputValue(ruleId, giftId, giftSelectedMapQty[giftId]);
        }
    
        this.ruleIdMapSelectedGift.set(ruleId, giftSelectedMapQty);
    }

    changeGiftQuantity(evt, ruleId, giftId) {
        const giftQuantity = this.ruleIdMapData.get(ruleId).gift_qty * this.ruleIdMapCanClaimTime.get(ruleId);
        const giftSelectedMapQty = this.ruleIdMapSelectedGift.get(ruleId);
        const totalSelectedGift = this.getTotalSelectedGift(ruleId);
        const residualGift = giftQuantity - totalSelectedGift;
        const currentValue = giftSelectedMapQty[giftId];

        let value = parseInt(evt.value, 10);
        value = isNaN(value) ? 1 : value;
        value < 1 ? (value = 1) : "";

        const changeValue = value - currentValue;
        let newValue = value;
        if(changeValue > residualGift){
            newValue = residualGift + currentValue;
            const ruleTranslation = this.getRuleTranslation(ruleId);
            this.showError(ruleId, ruleTranslation.manual_choose_gift?.choose_enough_gift || "You've chosen enough rewards.");
        }
        evt.value = newValue;
        giftSelectedMapQty[giftId] = newValue;
        this.ruleIdMapSelectedGift.set(ruleId, giftSelectedMapQty);

        this.changeSelectorInputValue(ruleId, giftId, newValue);
    }

    renderOffer = (listParentDisplay) => {
        if(listParentDisplay.length){
            let offerMarkup = "";
            const hasMoreItem = listParentDisplay.length > 3;
            JSON.parse(JSON.stringify(listParentDisplay)).splice(0,3).map((parentId, index) => {
                const parentData = this.shopifyIdMapData.get(parentId);
                if(parentData){
                offerMarkup += `
                    <div class="salepify-fg-advanced-offer__item ${(index == 2 && hasMoreItem) ? "salepify-fg-advanced-offer__item--last" : ""}">
                        <img src="${parentData.image}" alt="${parentData.title}" width="71" height="71"/>
                        ${
                            (index == 2 && hasMoreItem) ? 
                            `<svg width="19" height="5" viewBox="0 0 19 5" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M5.0625 2.5C5.0625 3.72538 4.06913 4.71875 2.84375 4.71875C1.61837 4.71875 0.625 3.72538 0.625 2.5C0.625 1.27462 1.61837 0.28125 2.84375 0.28125C4.06913 0.28125 5.0625 1.27462 5.0625 2.5Z" fill="white"/>
                                <path d="M11.7188 2.5C11.7188 3.72538 10.7254 4.71875 9.5 4.71875C8.27462 4.71875 7.28125 3.72538 7.28125 2.5C7.28125 1.27462 8.27462 0.28125 9.5 0.28125C10.7254 0.28125 11.7188 1.27462 11.7188 2.5Z" fill="white"/>
                                <path d="M16.1562 4.71875C17.3816 4.71875 18.375 3.72538 18.375 2.5C18.375 1.27462 17.3816 0.28125 16.1562 0.28125C14.9309 0.28125 13.9375 1.27462 13.9375 2.5C13.9375 3.72538 14.9309 4.71875 16.1562 4.71875Z" fill="white"/>
                            </svg>` : ""
                        }
                    </div>
                `;
                }
            })

            return `
                ${offerMarkup}
                <div class="salepify-fg-advanced-offer__plus-icon">
                    <svg viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" clipRule="evenodd" d="M7 0.5C7.55228 0.5 8 0.947715 8 1.5V6.5H13C13.5523 6.5 14 6.94772 14 7.5C14 8.05228 13.5523 8.5 13 8.5H8V13.5C8 14.0523 7.55228 14.5 7 14.5C6.44772 14.5 6 14.0523 6 13.5V8.5H1C0.447715 8.5 0 8.05228 0 7.5C0 6.94771 0.447715 6.5 1 6.5L6 6.5V1.5C6 0.947715 6.44772 0.5 7 0.5Z" fill="#111827"/>
                    </svg>
                </div>

                <div class="salepify-fg-advanced-gift-offer-img">
                    <div class="salepify-fg-advanced-gift-offer-img__image">
                        <img src="${this.offerImg}"/>
                    </div>
                    <div class="salepify-fg-advanced-gift-offer-img__label">
                        <p>Gift</p>
                    </div>
                </div>
            `
        }else {
            return "";
        }
    }

    renderCustomerBuy = (listParentDisplay, parentMapRequiredQty) => {
        let customerByMarkup = ``;
            
        listParentDisplay.map((parentId) => {
            const parentData = this.shopifyIdMapData.get(parentId);
            if(parentData){
            customerByMarkup += `
                <div class="salepify-fg-advanced-customer-buy-item block--flex-inline">
                    <div class="salepify-fg-advanced-customer-buy-item-info block--flex-inline">
                        <div class="salepify-fg-advanced-customer-buy-item-info__img">
                            <img src="${parentData.image}" alt="${parentData.title}" />
                        </div>

                        <div class="salepify-fg-advanced-customer-buy-item-description block--flex">
                            <a class="salepify-fg-advanced-customer-buy-item-description__title" href="/products/${parentData.handle}">
                                ${parentData.title}
                            </a>
                            <p class="salepify-fg-advanced-customer-buy-item-description__price">
                                ${this.formatMoney(parentData.price * 100)}
                            </p>

                            ${
                                parentMapRequiredQty[parentId] ? 
                                `<p class="salepify-fg-advanced-gift-info__quantity">
                                    x${parentMapRequiredQty[parentId]}
                                </p>` : ""
                            }
                        </div>      
                    </div>

                    <button class="salepify-fg-advanced-customer-buy-item__add-to-cart" onclick='window.tlAdvancedFreeGift.handleAddToTempCart("${parentData.productId ? parentData.id : parentData.variants[0]}")'>
                        <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path fillRule="evenodd" clipRule="evenodd" d="M5 0C5.55228 0 6 0.447715 6 1V4L9 4C9.55228 4 10 4.44772 10 5C10 5.55228 9.55228 6 9 6H6V9C6 9.55229 5.55228 10 5 10C4.44771 10 4 9.55229 4 9V6H1C0.447715 6 0 5.55228 0 5C5.96046e-08 4.44771 0.447715 4 1 4L4 4V1C4 0.447715 4.44771 0 5 0Z" fill="white"/>
                        </svg>
                    </button>
                </div>
            `;
            }
        })
        return customerByMarkup;
    }

    renderUpsellMsg = (conditionState, rule) => {
        const ruleTranslation = this.getRuleTranslation(rule.id);
    
        if (conditionState === this.CONDITION_STATE.MET_BEFORE_CLAIM) {
            return rule.auto_add_gift ? ruleTranslation.upsell_msg.for_auto_add : ruleTranslation.upsell_msg.meet_condition;
        }
    
        if (conditionState === this.CONDITION_STATE.MET_AFTER_CLAIM) {
            return ruleTranslation.upsell_msg.claimed;
        }
    
        return ruleTranslation.upsell_msg.not_meet_condition;
    };

    // Get list gift from collection
    getCollectionGifts = async (ruleId) => {
        const ruleData = this.ruleIdMapData.get(ruleId);
        const collectionIds = ruleData.listChilds.map(child => child.shopify_id);
        const hideOutOfStock = ruleData.hide_gift_out_of_stock;
        const productGifts = this.ruleIdMapProductGifts.get(ruleId) ?? [];
        const gifts = [];
        let numberLoadedProduct = 0;

        let loadingStatus = this.ruleIdMapLoadingCollectionStatus.get(ruleId)
            ? JSON.parse(JSON.stringify(this.ruleIdMapLoadingCollectionStatus.get(ruleId)))
            : { is_complete_loading: false };
        if(!loadingStatus.is_complete_loading){
            for (let i = 0; i < collectionIds.length; i++) {
                const id = collectionIds[i];
                const pageInfo = loadingStatus[id] ?? { has_next_page: true, end_cursor: null}
                if(pageInfo.has_next_page){
                    const reqData = await this.getCollectionData(id, pageInfo.end_cursor);
                    if(reqData){
                        const listProducts = reqData.collection.products.nodes;
                        listProducts.map((product) => {
                            const nonGlobalProductId = product.id.split("/").pop();
                            if(!productGifts.includes(nonGlobalProductId)) {
                                const productImage = product.featuredImage ? product.featuredImage.url : this.defaultImg;
                                product.variants.nodes.map(variant => {
                                    const variantId = String(variant.id);
                                    const nonGlobalId = variantId.split("/").pop();

                                    const variantData = this.shopifyIdMapData.get(nonGlobalId) ?? {
                                        id: nonGlobalId,
                                        title: `${product.title} - ${variant.title.toLocaleLowerCase() !== "default title" ? variant.title : ""}`,
                                        handle: product.handle,
                                        image: variant.image ? variant.image.url : productImage,
                                        price: parseFloat(variant.price.amount) * this.currencyRate,
                                        available: variant.availableForSale,
                                        productId: nonGlobalProductId
                                    }
                                    this.shopifyIdMapData.set(nonGlobalId, variantData);
                                    if((hideOutOfStock && variantData.available) || !hideOutOfStock) {
                                        gifts.push(variantData);
                                    }
                                })

                                numberLoadedProduct ++;
                                productGifts.push(nonGlobalProductId)
                            }
                        })

                        const pageInfo = reqData.collection.products.pageInfo;
                        loadingStatus = {
                            ...loadingStatus,
                            [id]: {
                                end_cursor: pageInfo.endCursor,
                                has_next_page: pageInfo.hasNextPage
                            }
                        }
                    }
                }
                if(numberLoadedProduct >= this.ROW_PER_PAGE) {
                    break;
                }else if(i == collectionIds.length - 1) {
                    loadingStatus = {
                        ...loadingStatus,
                        is_complete_loading: true
                    }
                }
            }
        }
        this.ruleIdMapLoadingCollectionStatus.set(ruleId, JSON.parse(JSON.stringify(loadingStatus)))
        this.ruleIdMapProductGifts.set(ruleId, productGifts);
        return gifts;
    }

    getGifts = async (rule, listChildDisplayIds = [], childMapRequiredQty = {}) => {
        let gifts = [];
        const {
            id: ruleId , 
            auto_add_gift: isAutoAdd,  
            auto_add_type: autoAddType, 
            hide_gift_out_of_stock: hideOutOfStock, 
            gift_qty: giftQty,
            gift_type: giftType
        } = rule;

        if(giftType == this.GIFT_TYPE.VARIANT){
            if(isAutoAdd){
                if(autoAddType == this.AUTO_ADD_TYPE.FIRST_AVAILABLE){
                    for (let i = 0; i < listChildDisplayIds.length; i++) {
                        const giftId = listChildDisplayIds[i];
                        const giftData = this.shopifyIdMapData.get(giftId);
                        
                        if(giftData && giftData.available){
                            gifts.push(giftData);
                            const selectedGift = {};
                            selectedGift[giftId] = giftQty;
                            this.ruleIdMapSelectedGift.set(ruleId, selectedGift);
                            break;
                        }
                    }
                }else{
                    const giftAutoAdd = Object.keys(childMapRequiredQty);
                    gifts = listChildDisplayIds
                        .filter((giftId) => giftAutoAdd.includes(giftId))
                        .map(giftId => ({
                            ...this.shopifyIdMapData.get(giftId),
                            quantity: childMapRequiredQty[giftId]
                        }))
                        .filter(Boolean);

                    this.ruleIdMapSelectedGift.set(ruleId, childMapRequiredQty);
                }

            }else {
                listChildDisplayIds.map(giftId => {
                    const giftData = this.shopifyIdMapData.get(giftId);

                    if(giftData && ((hideOutOfStock && giftData.available) || !hideOutOfStock)){
                        gifts.push(giftData)
                    }
                });
            }
        }else if(giftType == this.GIFT_TYPE.SAME_BUY){
            this.updateSelectedGiftWithSameBuyOpt(rule);
        }else {
            gifts = await this.getCollectionGifts(ruleId);
        }

        return gifts;
    }

    renderGifts = (rule, gifts, conditionState) => {
        const {
            id: ruleId , 
            auto_add_gift: isAutoAdd,  
            auto_add_type: autoAddType,
            gift_qty: giftQty
        } = rule;
        let giftMarkup = "";

        const isConditionMet = conditionState !== this.CONDITION_STATE.NOT_MET;
        const isShowSelector =  conditionState === this.CONDITION_STATE.MET_BEFORE_CLAIM && !isAutoAdd;
        
        gifts.map((giftData) => {
            const giftId = giftData.id;
     
            let giftSelectedQty = 1;
            if(isAutoAdd) {
                giftSelectedQty = autoAddType == this.AUTO_ADD_TYPE.FIRST_AVAILABLE ? 
                    giftQty : (giftData.quantity ?? 1);
            }

            const isGiftsOnlyLayout = this.#displaySettings.layout === this.POPUP_LAYOUT.GIFTS_ONLY;

            const priceAfterDiscount = this.getPriceAfterDiscount(rule, giftData.price);
            const ruleTranslation = this.getRuleTranslation(ruleId);

            const freeTextContent = priceAfterDiscount == 0
                ? isGiftsOnlyLayout ? ruleTranslation.free_text : ruleTranslation.product_detail.free_text_content
                : this.formatMoney(priceAfterDiscount * 100 * giftSelectedQty);
            
            if (this.#displaySettings.layout === this.POPUP_LAYOUT.GIFTS_ONLY) {
                giftMarkup += `
                    <div class="salepify-fg-advanced__gift" id="salepify-fg-advanced-gift-${ruleId}-${giftId}">
                        <div class="salepify-fg-advanced__gift-details">
                            <img class="salepify-fg-advanced__gift-img" src="${giftData.image}" alt="" />
                            <div class="salepify-fg-advanced__gift-info">
                                <div class="salepify-fg-advanced__gift-title">${giftData.title}</div>
                                <div class="salepify-fg-advanced__gift-pricing">
                                    <p class="salepify-fg-advanced__gift-price">${freeTextContent}</p>
                                    <p class="salepify-fg-advanced__gift-compare-at-price salepify-fg-advanced-gift-description__price--compare">
                                        ${this.formatMoney(giftData.price * 100 * giftSelectedQty)}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div>
                            <div 
                                id="salepify-fg-advanced-checkbox-wrapper-${ruleId}-${giftId}" 
                                class="salepify-fg-advanced-checkbox ${isShowSelector ? "salepify-fg-advanced-checkbox--show" : "salepify-fg-advanced-checkbox--hide"}"
                                style="width: auto; height: auto;"
                            >
                                <input 
                                    id="salepify-fg-advanced-checkbox-${ruleId}-${giftId}" 
                                    class="salepify-fg-advanced-checkbox__inp-cbx salepify-fg-advanced__gift-quantity" 
                                    type="checkbox"
                                    style="width: 60px; height: 40px;"
                                    onclick='window.tlAdvancedFreeGift.handleChangCheckBox(this, ${ruleId}, "${giftId}")'
                                />
                                <label 
                                    class="salepify-fg-advanced__gift-quantity" 
                                    for="salepify-fg-advanced-checkbox-${ruleId}-${giftId}"
                                    style="display: block; width: fit-content; display: flex; gap: 8px;" 
                                >
                                    ${ruleTranslation.add_to_cart_btn} +
                                </label>
                            </div>

                            <div 
                                class="salepify-fg-advanced__gift-quantity salepify-fg-advanced-gift-qty-selector" 
                                id="salepify-fg-advanced__gift-quantity-${ruleId}-${giftId}"
                            >
                                <button 
                                    class="salepify-fg-advanced-gift-qty-selector__decrease salepify-fg-advanced__qty-btn" 
                                    onclick='window.tlAdvancedFreeGift.decreaseGiftQuantity(${ruleId}, "${giftId}")'
                                >
                                    <svg width="14" height="2" viewBox="0 0 14 2" fill="none" 
                                        xmlns="http://www.w3.org/2000/svg">
                                        <path fillRule="evenodd" clipRule="evenodd" 
                                            d="M0 1C0 0.734784 0.105357 0.48043 0.292893 0.292893C0.48043 0.105357 0.734784 0 1 0H13C13.2652 0 13.5196 0.105357 13.7071 0.292893C13.8946 0.48043 14 0.734784 14 1C14 1.26522 13.8946 1.51957 13.7071 1.70711C13.5196 1.89464 13.2652 2 13 2H1C0.734784 2 0.48043 1.89464 0.292893 1.70711C0.105357 1.51957 0 1.26522 0 1Z" 
                                            fill="white"/>
                                    </svg>
                                </button>
                                
                                <input 
                                    class="salepify-fg-advanced__qty-input salepify-fg-advanced-gift-qty-selector__quantity" 
                                    type="text" 
                                    value="1" 
                                    min="1" 
                                    onchange='window.tlAdvancedFreeGift.changeGiftQuantity(this, ${ruleId}, "${giftId}")' 
                                />

                                <button 
                                    class="salepify-fg-advanced-gift-qty-selector__increase salepify-fg-advanced__qty-btn" 
                                    onclick='window.tlAdvancedFreeGift.increaseGiftQuantity(${ruleId}, "${giftId}")'
                                >
                                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none" 
                                        xmlns="http://www.w3.org/2000/svg">
                                        <path fillRule="evenodd" clipRule="evenodd" 
                                            d="M5 0C5.55228 0 6 0.447715 6 1V4L9 4C9.55228 4 10 4.44772 10 5C10 5.55228 9.55228 6 9 6H6V9C6 9.55229 5.55228 10 5 10C4.44771 10 4 9.55229 4 9V6H1C0.447715 6 0 5.55228 0 5C5.96046e-08 4.44771 0.447715 4 1 4L4 4V1C4 0.447715 4.44771 0 5 0Z" 
                                            fill="white"/>
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                `;
            } else if (this.#displaySettings.layout === this.POPUP_LAYOUT.DETAILED_LIST) {
                giftMarkup += `
                    <div id="salepify-fg-advanced-gift-${ruleId}-${giftId}" 
                        class="salepify-fg-advanced-gift block--flex-inline">
                        
                        <div class="salepify-fg-advanced-checkbox 
                            ${isShowSelector ? "salepify-fg-advanced-checkbox--show" : "salepify-fg-advanced-checkbox--hide"}">
                            
                            <input class="salepify-fg-advanced-checkbox__inp-cbx" 
                                id="salepify-fg-advanced-checkbox-${ruleId}-${giftId}" 
                                type="checkbox"
                                onclick='window.tlAdvancedFreeGift.handleChangCheckBox(this, ${ruleId}, "${giftId}")' />
                            
                            <label class="salepify-fg-advanced-checkbox__cbx" 
                                for="salepify-fg-advanced-checkbox-${ruleId}-${giftId}">
                                <span>
                                    <svg width="12px" height="10px">
                                        <use xlink:href="#salepify-fg-advanced-gift-tick-${ruleId}-${giftId}"></use>
                                    </svg>
                                </span>
                            </label>

                            <svg class="salepify-fg-advanced-checkbox__inline-svg">
                                <symbol id="salepify-fg-advanced-gift-tick-${ruleId}-${giftId}" viewBox="0 0 12 10">
                                    <polyline points="1.5 6 4.5 9 10.5 1"></polyline>
                                </symbol>
                            </svg>

                        </div>

                        <div class="salepify-fg-advanced-gift-info block--flex-inline">
                            <div class="salepify-fg-advanced-gift-info__img 
                                ${!isConditionMet ? "salepify-fg-advanced-gift-info__img--condition-not-met" : ""}">
                                
                                <img src="${giftData.image}" />

                                <svg width="24" height="24" 
                                    viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"
                                    style="display: ${!isConditionMet ? "block" : "none"}">
                                    
                                    <path d="M12 15V17M6 21H18C19.1046 21 20 20.1046 20 19V13C20 11.8954 19.1046 11 18 11H6C4.89543 11 4 11.8954 4 13V19C4 20.1046 4.89543 21 6 21ZM16 11V7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7V11H16Z" 
                                        stroke="#111827" strokeWidth="2" strokeLinecap="round"/>
                                </svg>                    

                            </div>

                            <div class="salepify-fg-advanced-gift-description">
                                <a class="salepify-fg-advanced-gift-description__title" 
                                    href="/products/${giftData.handle}?variant=${giftData.id}">
                                    ${giftData.title}
                                </a>

                                <div class="salepify-fg-advanced-gift-description__price block--flex-inline">
                                    <p class="salepify-fg-advanced-gift-description__price--free">${freeTextContent}</p>
                                    <p class="salepify-fg-advanced-gift-description__price--compare"
                                        style="display: ${priceAfterDiscount >= giftData.price ? "none" : "block"}">
                                        ${this.formatMoney(giftData.price * 100 * giftSelectedQty)}
                                    </p>
                                </div>

                                ${
                                    isAutoAdd 
                                        ? `<p class="salepify-fg-advanced-gift-info__quantity">
                                            ${autoAddType == this.AUTO_ADD_TYPE.FIRST_AVAILABLE ? `x${giftQty}` : `x${giftSelectedQty}`}
                                        </p>` 
                                        : ""
                                }
                            </div>
                        </div>

                        <div class="salepify-fg-advanced-gift-qty-selector block--flex-inline">
                            <button class="salepify-fg-advanced-gift-qty-selector__decrease"
                                onclick='window.tlAdvancedFreeGift.decreaseGiftQuantity(${ruleId}, "${giftId}")'>
                                <svg width="14" height="2" viewBox="0 0 14 2" fill="none" 
                                    xmlns="http://www.w3.org/2000/svg">
                                    <path fillRule="evenodd" clipRule="evenodd" 
                                        d="M0 1C0 0.734784 0.105357 0.48043 0.292893 0.292893C0.48043 0.105357 0.734784 0 1 0H13C13.2652 0 13.5196 0.105357 13.7071 0.292893C13.8946 0.48043 14 0.734784 14 1C14 1.26522 13.8946 1.51957 13.7071 1.70711C13.5196 1.89464 13.2652 2 13 2H1C0.734784 2 0.48043 1.89464 0.292893 1.70711C0.105357 1.51957 0 1.26522 0 1Z" 
                                        fill="white"/>
                                </svg>
                            </button>

                            <input type="text" class="salepify-fg-advanced-gift-qty-selector__quantity"
                                value="1" min="1"
                                onchange='window.tlAdvancedFreeGift.changeGiftQuantity(this, ${ruleId}, "${giftId}")' />

                            <button class="salepify-fg-advanced-gift-qty-selector__increase"
                                onclick='window.tlAdvancedFreeGift.increaseGiftQuantity(${ruleId}, "${giftId}")'>
                                <svg width="10" height="10" viewBox="0 0 10 10" fill="none" 
                                    xmlns="http://www.w3.org/2000/svg">
                                    <path fillRule="evenodd" clipRule="evenodd" 
                                        d="M5 0C5.55228 0 6 0.447715 6 1V4L9 4C9.55228 4 10 4.44772 10 5C10 5.55228 9.55228 6 9 6H6V9C6 9.55229 5.55228 10 5 10C4.44771 10 4 9.55229 4 9V6H1C0.447715 6 0 5.55228 0 5C5.96046e-08 4.44771 0.447715 4 1 4L4 4V1C4 0.447715 4.44771 0 5 0Z" 
                                        fill="white"/>
                                </svg>
                            </button>
                        </div> 
                    </div>
                `;
            }
        });

        return giftMarkup;
    }

    handleLoadingGift = async (ruleId) => {
        const listGiftEle = document.querySelector(`#salepify-fg-advanced-main-section-${ruleId} .salepify-fg-advanced-gift-list`);

        const setLoadingRule = (isLoading) => {
            const loadingStatus = this.ruleIdMapLoadingCollectionStatus.get(ruleId) ?? {};
            if(isLoading) {
                listGiftEle.innerHTML += `
                    <div class="salepify-fg-advanced-gift-list__loader">
                        <div class="loader"></div>
                    </div>
                ` ;
            }else {
                const loader = document.querySelector(`#salepify-fg-advanced-main-section-${ruleId} .salepify-fg-advanced-gift-list__loader`);
                if(loader) loader.parentNode.removeChild(loader);
            }
            this.ruleIdMapLoadingCollectionStatus.set(ruleId, {
                ...loadingStatus,
                is_loading: isLoading
            });
        }

        const loadingStatus = this.ruleIdMapLoadingCollectionStatus.get(ruleId) ?? {};
        // Check is scrolling to bottom and is not complete loading ang is not loading
        if (
            !loadingStatus.is_loading &&
            !loadingStatus.is_complete_loading && 
            listGiftEle.scrollTop + listGiftEle.clientHeight >= listGiftEle.scrollHeight - 2
        ) {
            setLoadingRule(true);
            const gifts = await this.getCollectionGifts(ruleId);

            listGiftEle.innerHTML += this.renderGifts(
                this.ruleIdMapData.get(ruleId),
                gifts,
                this.ruleIdMapConditionState.get(ruleId)
            )

            setLoadingRule(false);
        }
    }

    mergeCartTempToCart = async () => {
        this.loadingWhenClaim();
        const items = [];
        const discountCodes = []
        Array.from(this.itemsInTempCart).map(([itemId, itemData]) => {
            items.push({
                'id': itemId,
                'quantity': itemData.quantity
            })
        });

        Array.from(this.giftsInTempCart).map(([giftId, giftData]) => {
            Object.entries(giftData.ruleIdMapQty).map(([id, quantity]) => {
                const ruleId = Number(id);
                const ruleData = this.ruleIdMapData.get(ruleId);
                const itemData = {
                    id: giftId,
                    quantity: quantity,
                    properties: {}
                }
                itemData.properties[this.PROPERTY] = ruleId;
                items.push(itemData);

                discountCodes.push(ruleData.name)
            })
        });

        await fetch(window.Shopify.routes.root + 'cart/add.js?app=salepify', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                'items': items
            })
        });

        await this.applyDiscounts(discountCodes);

        if(!window.TLCustomEventGiftsAdvanced){
            await tlPopupCartReRender();
            this.handleToggle();
            this.removeLoading();
            return;
        } else if (window.TLCustomEventGiftsAdvanced == 1) {
            window.dispatchEvent(new CustomEvent("TLCustomEvent:FreeGiftsAdvanced-mergeCartTempToCart"));
        }
    }

    handleAddToTempCart = async (variantId) => {
        // Update the value of the item in the temporary cart 
        const currentItemDataInTempCart = this.itemsInTempCart.get(variantId) ? 
            this.itemsInTempCart.get(variantId) : { quantity: 0, key: null};

        currentItemDataInTempCart.quantity ++;

        let newKey = currentItemDataInTempCart.key;
        // Check if field key is invalid => get key for item has id = variantid  
        if(!newKey) {
            const itemInCartArr = Array.from(this.itemsInCart);
            for (let i = 0; i < itemInCartArr.length; i++) {
                const [key, itemData] = itemInCartArr[i];
                
                if(itemData.id === variantId){
                    newKey = key;
                    break;
                }
            }
        }


        // After checking cart, if there are no item has id = variantId
        if(!newKey){    
            // Assign newKey = variantId
            newKey = variantId;
            
            const itemData = this.shopifyIdMapData.get(variantId);

            let collectionIds = this.productIdMapCollection.get(itemData.productId)
            if(!collectionIds) {
                await this.getVariantData(variantId);
                collectionIds = this.productIdMapCollection.get(itemData.productId)
            }
            // Add a new key = variantId ro itemsInCart
            this.itemsInCart.set(variantId, {
                id: variantId,
                price: itemData.price,
                quantity: 1 ,
                productId: itemData.productId,
                collectionIds: collectionIds
            })
        }else {
            // Update quantity to itemInCart variable
            const currentItemDataInCart = this.itemsInCart.get(newKey);
            currentItemDataInCart.quantity ++;
            this.itemsInCart.set(newKey, currentItemDataInCart);
        }
        //Update data itemsInTempCart
        this.itemsInTempCart.set(variantId, {
            ...currentItemDataInTempCart,
            key : newKey
        });

        this.reRender();
    }

    handleRemoveFromTempCart = (variantId) => {
        let listItemRemove = [];
        if(variantId){
            listItemRemove.push(this.itemsInTempCart.get(variantId))
            this.itemsInTempCart.delete(variantId);
        }else {
            Array.from(this.itemsInTempCart).map(([itemId, itemData]) => {
                listItemRemove.push(itemData);
            })

            this.itemsInTempCart.clear();
        }

        listItemRemove.map(itemRemove => {
            const key = itemRemove.key;
            const currentItemDataInCart = this.itemsInCart.get(key);
            const newQty = currentItemDataInCart.quantity - itemRemove.quantity;

            if(newQty > 0){
                currentItemDataInCart.quantity = newQty;
                this.itemsInCart.set(key, currentItemDataInCart);
            }else {
                this.itemsInCart.delete(key);
            }
        })

        if(this.itemsInTempCart.size == 0) {
            this.giftsInTempCart.clear();
        }
        this.ruleIdMapParentInCart.clear()
        this.reRender();
    }

    updateGiftsInTempCart = (ruleId, isAutoAdd = false) => {
        const giftSelected = this.ruleIdMapSelectedGift.get(ruleId);

        Object.entries(giftSelected).map(([itemId, quantity]) => {
            // Update giftsInTempCart variable
            const initialData = {
                id: itemId,
                quantity: quantity,
                isAutoAdd: isAutoAdd, 
                ruleIdMapQty: {}
            }
            const curentData = this.giftsInTempCart.get(itemId);
            if(curentData){
                initialData.quantity += curentData.quantity;
                initialData.ruleIdMapQty = JSON.parse(JSON.stringify(curentData.ruleIdMapQty));
            }
            const currentGiftQtyOfRule = initialData.ruleIdMapQty[ruleId] ? initialData.ruleIdMapQty[ruleId] : 0;
            initialData.ruleIdMapQty[ruleId] =  currentGiftQtyOfRule + quantity;

            this.giftsInTempCart.set(itemId, initialData);
        })
    }

    handleAddGiftToTempCart = (ruleId) => {
        this.updateGiftsInTempCart(ruleId);
        this.reRender();
    }

    handleRemoveGiftFromTempCart = (variantId) => { 
        this.giftsInTempCart.delete(variantId);
        this.reRender();
    }

    loadingWhenClaim = () => {
        document.querySelectorAll(`.salepify-fg-advanced-wrapper button, 
            .salepify-fg-advanced-wrapper .salepify-fg-advanced-checkbox__inp-cbx, 
            .salepify-fg-advanced-wrapper .salepify-fg-advanced-gift-qty-selector__quantity`
        ).forEach(ele =>  ele.setAttribute("disabled", ''))
        
        //Add loading to button claim
        document.querySelectorAll(`.salepify-fg-advanced-wrapper .salepify-fg-advanced-footer__claim-btn,
            .salepify-fg-advanced-wrapper .salepify-fg-advanced--gifts-only .salepify-fg-advanced__claim-button`).forEach(ele => {
            ele.setAttribute('disabled', '')
            ele.classList.add("salepify-fg-loading");
            ele.innerHTML = '<div class="button-loader"></div>';
        });

        //Add loading to temp Cart button
        const addToTempCartBtn = document.querySelector(".salepify-fg-advanced-wrapper .salepify-fg-advanced-temp-cart__add-to-cart-btn")
        addToTempCartBtn.setAttribute('disabled', '')
        addToTempCartBtn.classList.add("salepify-fg-loading");
        addToTempCartBtn.innerHTML = '<div class="button-loader"></div>';

        const removeFromCartBtn = document.querySelector(".salepify-fg-advanced-wrapper .salepify-fg-advanced-temp-cart__remove-all-btn");
        removeFromCartBtn.setAttribute('disabled', '')
        removeFromCartBtn.style.color = '#d7d7d7';
    }

    removeLoading = () => {
        document.querySelectorAll(`.salepify-fg-advanced-wrapper button, 
            .salepify-fg-advanced-wrapper .salepify-fg-advanced-checkbox__inp-cbx, 
            .salepify-fg-advanced-wrapper .salepify-fg-advanced-gift-qty-selector__quantity`
        ).forEach(ele =>  ele.removeAttribute("disabled"))

        this.reRender();
    }

    #getCartData = async () => {
        const getCartDataReq = await fetch(`https://${window.Shopify.shop}/api/${this.API_VERSION}/graphql.json`, {
            method: 'POST',
            headers: {
                "Accept": 'application/json',
                "Content-Type": 'application/json',
                "X-Shopify-Storefront-Access-Token": this.#storeAccessToken,
            },
            body: JSON.stringify({
                query: `query cartQuery($cartId: ID!) {
                    cart(id: $cartId) {
                        id
                        createdAt
                        updatedAt
                        checkoutUrl
                        discountCodes{
                            code
                            applicable
                        }
                    }
                }`,
                variables: {
                    "cartId": `gid://shopify/Cart/${this.cartId}`
                }
            })
        }) 

        return await getCartDataReq.json()
    }

    #updateCartDiscountCodes = async (discounts) => {
        const getCartDataReq = await fetch(`https://${window.Shopify.shop}/api/${this.API_VERSION}/graphql.json`, {
            method: 'POST',
            headers: {
                "Accept": 'application/json',
                "Content-Type": 'application/json',
                "X-Shopify-Storefront-Access-Token": this.#storeAccessToken,
            },
            body: JSON.stringify({
                query: `mutation updateCartDiscountCodes($cartId: ID!, $discountCodes: [String!] ) {
                    cartDiscountCodesUpdate(cartId: $cartId, discountCodes: $discountCodes) {
                        cart {
                            id
                            discountCodes{
                                code
                                applicable
                            }
                        }
                        
                        userErrors {
                            field
                            message
                        }
                    }
                }`,
                variables: {
                    "cartId": `gid://shopify/Cart/${this.cartId}`,
                    "discountCodes": discounts
                }
            })
        }) 

        return await getCartDataReq.json()
    }

    applyDiscounts = async (discounts) => {
        try {
            const getCartDataReq = await this.#getCartData();

            const otherDiscountsInCart = [];
            const discountsAppInCart = [];

            let newDiscounts = [];
            let statusDCInCart = [];

            if(getCartDataReq.data.cart){
                statusDCInCart = getCartDataReq.data.cart.discountCodes;
                getCartDataReq.data.cart.discountCodes.map((discount) => {
                    if(this.discountCodeMapRuleId.get(discount.code)){
                        discountsAppInCart.push(discount.code)
                    }else {
                        otherDiscountsInCart.push(discount.code)
                    }
                });

                const discountsNeedToApply = discounts.filter(discount => !discountsAppInCart.includes(discount));

                if(discountsNeedToApply.length !== 0 ){
                    // If a discount needs to be applied to the cart but the cart already contains 5 discounts from our app, 
                    // it will not be applied and will return false.
                    if(discountsAppInCart.length == 5) return false;
                    newDiscounts = [...discountsNeedToApply, ...discountsAppInCart, ...otherDiscountsInCart];
                } 
            } else {
                // Case: The cart has not been initialized, it is necessary to retrieve the cartID
                const cartDataReq = await fetch("/cart.js");
                const cartDataRes = await cartDataReq.json();
                this.cartId = cartDataRes.token;
                newDiscounts = discounts
            }

            if(newDiscounts.length){
                const applyDiscount = await this.#updateCartDiscountCodes(newDiscounts.splice(0, 5));
                statusDCInCart =  applyDiscount?.data?.cartDiscountCodesUpdate?.cart?.discountCodes;
            }
            const appliedDC = statusDCInCart.filter((discount) => discounts.includes(discount.code) && discount.applicable)
            return appliedDC.length == discounts.length;
        } catch (error) {
            console.log("Error when applyDiscounts - Salepify Advanced Gift: ", error)
        }
    }

    handleAddGift = async (listRuleId) => {
        try {
            const items = [];
            const discountCodes = [];
            this.giftAddedImg = []
            for (let i = 0; i < listRuleId.length; i++) {
                const ruleId = listRuleId[i];
                const ruleData = this.ruleIdMapData.get(ruleId);

                const claimTime = ruleData.auto_add_gift ? this.ruleIdMapCanClaimTime.get(ruleId) : 1;
                let giftSelectedMapQty = this.ruleIdMapSelectedGift.get(ruleId) 
                    ? this.ruleIdMapSelectedGift.get(ruleId) : {};
                const giftSelectedArr = Object.entries(giftSelectedMapQty);
                giftSelectedArr.map(([variantId, quantity]) => {
                    items.push({
                        id: variantId,
                        quantity: quantity * claimTime,
                        properties: {
                            [this.PROPERTY]: ruleId
                        }
                    })
                });

                discountCodes.push(ruleData.name);
                const firstGiftAdded = giftSelectedArr[0];
                if(firstGiftAdded && ruleData.show_notification && ruleData.auto_add_gift){
                    const giftData = this.shopifyIdMapData.get(firstGiftAdded[0]);
                    this.giftAddedImg.push(giftData.image)
                }
            }

            const addCartReq = await fetch(window.Shopify.routes.root + 'cart/add.js?app=salepify', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    'items': items
                })
            });

            this.itemsInCart = new Map()

            // Check if all items have a price of 0
            const addCartRes = await addCartReq.json();
            
            if(addCartRes.status == 422) {
                return new Response(
                    JSON.stringify({status: 422, description: addCartRes.description }), 
                    { "status": 422, "Content-Type": "application/json" }
                );
            }
            const allItemsFree = addCartRes.items.every(item => item.price === 0);
            if (allItemsFree) {
                return addCartReq;
            }

            const appliedDC = await this.applyDiscounts(discountCodes);
            return appliedDC 
                ? addCartReq
                : new Response(
                    JSON.stringify({status: 400, description: "Unable to apply discount to the cart" }), 
                    { "status": 400, "Content-Type": "application/json" }
                );
        } catch (error) {
            console.log("Error when handleAddGift - Salepify Advanced Gift: ", error)
        }
    }

    handleAddGiftAndReload = async (ruleId) => { 
        this.loadingWhenClaim();
        const res = await this.handleAddGift([ruleId]);

        if(res.status !== 200){
            const resJson = await res.json();
            this.showError(ruleId, resJson.description);
            this.removeLoading();
            return;
        }
        if(!window.TLCustomEventGiftsAdvanced){
            await tlPopupCartReRender();
            this.handleToggle();
            this.removeLoading();
            return;
        } else if (window.TLCustomEventGiftsAdvanced == 1) {
            window.dispatchEvent(new CustomEvent("TLCustomEvent:FreeGiftsAdvanced-handleAddGiftAndReload"));
        }
    }

    removeRemainingGift = async() => {
        const cartDataReq = await fetch(window.Shopify.routes.root + 'cart.js')
        const cartDataRes = await cartDataReq.json();

        const giftWithoutDiscount = [];
        for (let i = 0; i < cartDataRes.items.length; i++) {
            const item = cartDataRes.items[i];
                        
            const itemKey = item.key;
            const itemId = String(item.id);

            let currentAppliedRuleId = null;
            item.discounts.map(discount => {
                if (this.discountCodeMapRuleId.get(discount.title)) {
                    currentAppliedRuleId = this.discountCodeMapRuleId.get(discount.title)
                }
            })

            let ruleInProperty = null;
            // If has property => is gift added from app 
            if(item.properties[this.PROPERTY]){
                const ruleId = item.properties[this.PROPERTY];
                ruleInProperty = this.ruleIdMapData.get(ruleId);
                if(ruleInProperty){
                    // Check if the line item has price !== 0 and no discount code applied and 
                    // the rule is set to auto-remove or the rule is not active, 
                    // then remove this line item.
                    if(
                        !currentAppliedRuleId && item.price !== 0 && this.blockedRuleId.has(ruleId)
                    ){
                        giftWithoutDiscount.push(itemKey)
                    }
                }
            }
        }

        await this.removeGiftAfterChange(giftWithoutDiscount);
    }

    // This function is called after there is a change in the cart - All APIs have finished running.
    removeGiftAfterChange = async (giftWithoutDiscount) => {
        if(!giftWithoutDiscount || giftWithoutDiscount.length == 0) return;
        try {
            const updates = {};

            giftWithoutDiscount.forEach(giftKey => updates[giftKey] = 0);
            const cartChangeReq = await fetch(window.Shopify.routes.root + 'cart/update.js?app=salepify', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ updates })
            });

            if(cartChangeReq.status == 200){
                if(!window.TLCustomEventGiftsAdvanced){
                    tlPopupCartReRender();
                    return;
                } else if (window.TLCustomEventGiftsAdvanced == 1) {
                    window.dispatchEvent(new CustomEvent("TLCustomEvent:FreeGiftsAdvanced-removeGiftAfterChange"));
                }
            }
        } catch (error) {
            console.log("Error when removeGiftAfterChange - Salepify Advanced Gift: ", error)
        }
    }

    // This function will be called during the cart change process - It runs while the call is in progress.
    handleRemoveGift = async (listRemove) => {
        try {
            const updates = {};

            for (let i = 0; i < listRemove.length; i++) {
                const {  id,  removeTime} = listRemove[i];
                const rule = this.ruleIdMapData.get(id)
                const giftAddedByApp = this.ruleIdMapGiftAddedByApp.get(id);

                if(rule.auto_add_gift && rule.auto_add_type == this.AUTO_ADD_TYPE.SELECT_TO_ADD && rule.gift_type == this.GIFT_TYPE.VARIANT){
                    const selectionGift = {};
                    rule.listChilds.map(child => {
                        selectionGift[child.shopify_id] = child.quantity ? child.quantity * removeTime : 0;
                    });

                    giftAddedByApp.forEach(gift => {
                        const giftId = gift.key.split(":")[0];
                        let newQty = gift.quantity - (selectionGift[giftId] ?? 0);
                            newQty = newQty > 0 ? newQty : 0;

                        updates[gift.key] = newQty;
                    })
                }else {
                    // Sort the gift list by price in descending order to remove the higher-priced ones first.
                    giftAddedByApp.sort((a, b) => b.price - a.price)
                    let numberGiftNeedToRemove = rule.gift_qty * removeTime;

                    giftAddedByApp.forEach(gift => {
                        let newQty = gift.quantity - numberGiftNeedToRemove;

                        if(numberGiftNeedToRemove > 0){
                            if(gift.quantity - numberGiftNeedToRemove >= 0){
                                numberGiftNeedToRemove = 0;
                            }else {
                                newQty = 0;
                                numberGiftNeedToRemove -= gift.quantity;
                            }
                        }

                        updates[gift.key] = newQty;
                    })
                }
            }

            await fetch(window.Shopify.routes.root + 'cart/update.js?app=salepify', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ updates })
            });
        } catch (error) {
            console.log("Error when handleRemoveGift - Salepify Advanced Gift: ", error)
        }
    }

    updateCartData = async () => {
        try {
            const cartDataReq = await fetch(window.Shopify.routes.root + 'cart.js')
            const cartDataRes = await cartDataReq.json();

            this.cartId = cartDataRes.token;
            const itemsInCart = new Map();
            const ruleIdMapGiftQtyInCart = new Map();
            const ruleIdMapGiftAddedByApp = new Map();
            const ruleIdMapParentInCart = new Map();
            const giftWithoutDiscount = [];
            if(cartDataRes.items.length){
                let ratio = 1;
                for (let i = 0; i < cartDataRes.items.length; i++) {
                    const item = cartDataRes.items[i];
                    if(!isNaN(item.price/item.presentment_price)){
                        ratio = item.price / item.presentment_price;
                        break;
                    }
                }
                
                for (let i = 0; i < cartDataRes.items.length; i++) {
                    const item = cartDataRes.items[i];
                        
                    const itemKey = item.key;
                    const itemId = String(item.id);
                    const productId = String(item.product_id);

                    const itemData = {
                        id: itemId,
                        price: item.price / ratio,
                        quantity: item.quantity ,
                        productId: productId,
                        collectionIds: this.productIdMapCollection.get(productId)
                    }

                    if(!itemData.collectionIds){
                        await this.getVariantData(itemId);
                        itemData.collectionIds = this.productIdMapCollection.get(productId);
                    }

                    let currentAppliedRuleId = null;
                    for (let i = 0; i < item.discounts.length; i++) {
                        const discount = item.discounts[i];
                        const code = this.decodeHtml(discount.title);
                        const rule = this.discountCodeMapRuleId.get(code);
                        if(rule){
                            currentAppliedRuleId = rule;
                            break;
                        }
                    }

                    let ruleInProperty = null;
                    // If has property => is gift added from app 
                    if(item.properties[this.PROPERTY]){
                        const ruleId = item.properties[this.PROPERTY];
                        ruleInProperty = this.ruleIdMapData.get(ruleId);
                        if(ruleInProperty){
                            // Save list gift added from app by RuleId
                            const currentGiftInCart = ruleIdMapGiftAddedByApp.get(ruleId) ?
                                ruleIdMapGiftAddedByApp.get(ruleId) : [];

                            ruleIdMapGiftAddedByApp.set(ruleId, [...currentGiftInCart, {
                                key: itemKey,
                                quantity: item.quantity,
                                price: item.price
                            }])

                            // Check if the line item has price !== 0 and no discount code applied and 
                            // the rule is set to auto-remove or the rule is not active, 
                            // then remove this line item.
                            if(
                                !currentAppliedRuleId && item.price !== 0 &&
                                (ruleInProperty.auto_remove_gift || this.blockedRuleId.has(ruleId))
                            ){
                                giftWithoutDiscount.push(itemKey)
                            }
                        }
                    }

                    // Case: Item is applied discount => gift
                    // Or: Item has original price equals 0 and has property of app => is Gift
                    if(currentAppliedRuleId || (ruleInProperty && item.final_price == 0)){
                        const ruleData = currentAppliedRuleId ? this.ruleIdMapData.get(currentAppliedRuleId) : ruleInProperty;
                        const ruleId = ruleData.id;
                        // Update data for ruleIdMapGiftQtyInCart variable
                        const currentGiftQtyInCart = ruleIdMapGiftQtyInCart.get(ruleId) 
                            ? ruleIdMapGiftQtyInCart.get(ruleId) : 0;

                        ruleIdMapGiftQtyInCart.set(ruleId, currentGiftQtyInCart + item.quantity );

                        // Update data for ruleIdMapParentInCart variable with gift option same buy
                        if(ruleData.gift_type == this.GIFT_TYPE.SAME_BUY){
                            const currentParentInCart = ruleIdMapParentInCart.get(ruleId) || {};
                            currentParentInCart[itemId] = item.price / ratio;
                            ruleIdMapParentInCart.set(ruleId, currentParentInCart);
                        }
                    }else {
                        itemsInCart.set(itemKey, itemData);
                    }
                }
            }

            this.itemsInCart = new Map(itemsInCart);
            this.ruleIdMapGiftQtyInCart = new Map(ruleIdMapGiftQtyInCart);
            this.ruleIdMapGiftAddedByApp = new Map(ruleIdMapGiftAddedByApp);
            this.ruleIdMapParentInCart = new Map(ruleIdMapParentInCart);
            //Clear temp cart
            this.itemsInTempCart.clear();
            this.giftsInTempCart.clear();

            await this.removeGiftAfterChange(giftWithoutDiscount);
            if(this.firstLoading){
                await this.render();
                this.firstLoading = false;
            }else{
                await this.reRender();
            }
        } catch (error) {
            console.log("Error when updateCartData - Salepify Advanced Gift: ", error)
        }
    }

    getRemain = (rule) => {
        const ruleId = rule.id;
        let totalGiftInCart = this.ruleIdMapGiftQtyInCart.get(ruleId) ?
            this.ruleIdMapGiftQtyInCart.get(ruleId) : 0;  

        const giftIdMapQtyInTempCart = {};
        if(this.giftsInTempCart.size){
            if(rule.gift_type == this.GIFT_TYPE.VARIANT){
                rule.listChilds.map(gift =>{
                    const giftId = gift.shopify_id;
                    // Count gift in temp cart
                    const giftDataInTempCart = this.giftsInTempCart.get(giftId);
                    if(giftDataInTempCart && giftDataInTempCart.ruleIdMapQty[ruleId]){
                        const giftQtyOfRule = giftDataInTempCart.ruleIdMapQty[ruleId];
                        giftIdMapQtyInTempCart[giftId] = giftQtyOfRule;
                        totalGiftInCart += giftQtyOfRule;
                    }
                })
            }else {
                Array.from(this.giftsInTempCart).map(([giftId, giftData]) => {
                    const giftQtyOfRule = giftData.ruleIdMapQty[ruleId];
                    if(giftQtyOfRule){
                        giftIdMapQtyInTempCart[giftId] = giftQtyOfRule;
                        totalGiftInCart += giftQtyOfRule;
                    }
                })
            }
        }
        let totalProductApplied = 0;
        let numberProductApplied = 0;
        // Store the quantity of parent in cart
        const parentIdMapQty = new Map();
        const parentInCart = this.ruleIdMapParentInCart.get(ruleId) || {};
        // Get apply total and quantity of apply product
        if(rule.apply_to_product === this.APPLY_TO_PRODUCT.ALL){
            Array.from(this.itemsInCart).map(([key, variantData]) => {
                numberProductApplied += variantData.quantity;
                totalProductApplied += variantData.price * variantData.quantity;
                parentInCart[variantData.id] = variantData.price;
            })
        }else if(rule.apply_to_product === this.APPLY_TO_PRODUCT.PRODUCT){
            const parentShopifyIds = rule.listParents.map(parent => parent.shopify_id);
            Array.from(this.itemsInCart).map(([key, variantData]) => {
                if(parentShopifyIds.includes(variantData.productId)){
                    let currentQty = parentIdMapQty.get(variantData.productId) ? parentIdMapQty.get(variantData.productId) : 0;
                    currentQty += variantData.quantity;
                    numberProductApplied += variantData.quantity;
                    totalProductApplied += variantData.price * variantData.quantity;

                    parentIdMapQty.set(variantData.productId, currentQty);
                    parentInCart[variantData.id] = variantData.price;
                }
            })
        }else if(rule.apply_to_product === this.APPLY_TO_PRODUCT.VARIANT){
            const parentShopifyIds = rule.listParents.map(parent => parent.shopify_id);
            Array.from(this.itemsInCart).map(([key, variantData]) => {
                if(parentShopifyIds.includes(variantData.id)){
                    let currentQty = parentIdMapQty.get(variantData.id) ? parentIdMapQty.get(variantData.id) : 0;
                    currentQty += variantData.quantity;
                    numberProductApplied += variantData.quantity;
                    totalProductApplied += variantData.price * variantData.quantity;

                    parentIdMapQty.set(variantData.id, currentQty);
                    parentInCart[variantData.id] = variantData.price;
                }
            })
        }else if(rule.apply_to_product === this.APPLY_TO_PRODUCT.COLLECTION){
            const parentCollectionIds = rule.listParents.map( parent => parent.shopify_id)

            if(!rule.require_specific_qty){
                Array.from(this.itemsInCart).map(([key, variantData]) => {
                    let applyCollectionId = null
                    variantData.collectionIds.some(collectionId => {
                        if(parentCollectionIds.includes(collectionId)){
                            applyCollectionId = collectionId
                            return true;
                        }else { return false }
                    })
    
                    if(applyCollectionId){
                        let currentQty = parentIdMapQty.get(applyCollectionId) ? parentIdMapQty.get(applyCollectionId) : 0;
                        currentQty += variantData.quantity;
                        numberProductApplied += variantData.quantity;
                        totalProductApplied += variantData.price * variantData.quantity;
                        parentIdMapQty.set(applyCollectionId, currentQty);
                        parentInCart[variantData.id] = variantData.price;
                    }
                });
            } else {
                //Rearrange the item list in order, with items that have collections belonging to the parent collection list the least placed first.
                let sortedItems = Array.from(this.itemsInCart).sort(([_, a], [__, b]) => {
                    let aCollections = a.collectionIds.filter(id => rule.listParents.some(p => p.shopify_id === id));
                    let bCollections = b.collectionIds.filter(id => rule.listParents.some(p => p.shopify_id === id));
                
                    return aCollections.length - bCollections.length;
                });

                //The position of the collection being checked. Used to check collections in a circular sequence.
                let collectionIndex = 0;
                sortedItems.forEach(([key, variantData]) => {
                    //remainingQty is the quantity remaining of this variant
                    let remainingQty = variantData.quantity;
                    
                    while (remainingQty > 0) {
                        let applied = false;
                        //Current collection id is checked by collectionIndex
                        let collectionIdCurrent = rule.listParents[collectionIndex].shopify_id;
                        //The quantity of this collection before browsing this item.
                        let qtyBefore = parentIdMapQty.get(collectionIdCurrent) || 0;
                        let requiredQtyCurrent = 0;
                        //Maximum number of times the condition is satisfied by the collections
                        let maxSatisfiedRounds = 0;
                        rule.listParents.forEach(parent => {
                            let collectionId = parent.shopify_id;
                            let currentQty = parentIdMapQty.get(collectionId) || 0;
                            let satisfiedRounds = Math.floor(currentQty / parent.quantity);
                            maxSatisfiedRounds = Math.max(maxSatisfiedRounds, satisfiedRounds);
                        });

                        for (let i = 0; i < rule.listParents.length; i++) {
                            //Get collection by index, if all collection has been browsed, cycle back to get first collection.
                            const parent = rule.listParents[(collectionIndex + i) % rule.listParents.length];
                            const collectionId = parent.shopify_id;
                    
                            if (variantData.collectionIds.includes(collectionId) && remainingQty > 0) {
                                //currentQty is the quantity of products of this collectionId added to the map
                                let currentQty = parentIdMapQty.get(collectionId) || 0;
                                //requiredQty is the quantity required to apply for this round.
                                const requiredQty = (Math.floor(currentQty / parent.quantity) + 1) * parent.quantity;
                                if(collectionIdCurrent == collectionId) {
                                    requiredQtyCurrent = (maxSatisfiedRounds + 1) * parent.quantity;
                                }
                                
                                if (currentQty < requiredQty) {
                                    //Quantity applied to this collection.
                                    const qtyToAdd = Math.min(remainingQty, requiredQty - currentQty);
                                    parentIdMapQty.set(collectionId, currentQty + qtyToAdd);
                                    numberProductApplied += qtyToAdd;
                                    totalProductApplied += variantData.price * qtyToAdd;
                                    parentInCart[variantData.id] = variantData.price;
                                    //After applying the quantity of this variant to the collection, reduce the remaining quantity of this variant.
                                    remainingQty -= qtyToAdd;
                                    applied = true;
                                    
                                    break; 
                                }
                            }
                        }
                        
                        //Break if this item does not apply to any collection
                        if (!applied) break;

                        //The quantity of this collection after browsing this item.
                        let qtyAfter = parentIdMapQty.get(collectionIdCurrent) || 0;
                        //Move to the next collection if the current collection has a change in quantity and has reached the required quantity.
                        if (qtyAfter > qtyBefore && qtyAfter >= requiredQtyCurrent) {
                            //Recalculate the position of the next collection to be processed.
                            collectionIndex = (collectionIndex + 1) % rule.listParents.length;
                        }
                    }
                });
            }
        }else if(rule.apply_to_product === this.APPLY_TO_PRODUCT.TAG){
            const parentCollection = JSON.parse(rule.tag_collection);
            const parentCollectionId = parentCollection.id.split("/").pop();

            Array.from(this.itemsInCart).map(([key, variantData]) => {
                if(variantData.collectionIds.includes(parentCollectionId)){
                    numberProductApplied += variantData.quantity;
                    totalProductApplied += variantData.price * variantData.quantity;
                    parentInCart[variantData.id] = variantData.price;
                }
            })
        }
        this.ruleIdMapParentInCart.set(ruleId, parentInCart);

        // How many time can be recivied gift
        let canClaimCount =  0;
         // Initial a array contain all parent quantity
        const parentQtyInCarts = [];
         // Array contain the required specific quantity of parent
        const parentRequiredQty = [];

        if(rule.apply_condition_type === this.APPLY_CONDITION_TYPE.AMOUNT) {
            canClaimCount = Math.floor(totalProductApplied / (rule.apply_condition_value * this.currencyRate));
        }else {
            canClaimCount = Math.floor(numberProductApplied / rule.apply_condition_value);
        }

        if(rule.require_specific_qty){
            let tempCanClaimCount = 0;
            
            rule.listParents.map((parent) => {
                if(parent.quantity){
                    parentRequiredQty.push(parent.quantity);
                    parentQtyInCarts.push(parentIdMapQty.get(parent.shopify_id) ? parentIdMapQty.get(parent.shopify_id) : null);
                }
            })

            let stillApplicable = true;
            while(stillApplicable){
                // Check all required parent product is added to cart
                if(parentRequiredQty.every((requiredQty, index) => parentQtyInCarts[index] >= (requiredQty *(tempCanClaimCount + 1)))){
                    tempCanClaimCount ++;
                }else {
                    stillApplicable = false;
                }
            }

            // After checking required parent, assign canClaimCount = tempCanClaimCount
            if(canClaimCount >= tempCanClaimCount){
                canClaimCount = tempCanClaimCount;
            }
        }

        if(rule.maximum_per_order && canClaimCount >= rule.maximum_per_order){
            canClaimCount = rule.maximum_per_order
        }

        // How many time recivied gift
        let claimedCount = totalGiftInCart / rule.gift_qty;
        
        let conditionState = this.CONDITION_STATE.NOT_MET;
        let remain = 0;
        // let giftNumber = 0;
        let remainSpecific = 0;

        //Set canClaimTime of rule  = 1
        this.ruleIdMapCanClaimTime.set(ruleId, 1)
        // Case: canClaim > claimed => add gift to cart
        if(canClaimCount > claimedCount ){
            conditionState = this.CONDITION_STATE.MET_BEFORE_CLAIM;
            // giftNumber = rule.gift_qty * ();

            this.ruleIdMapCanClaimTime.set(ruleId, (canClaimCount * rule.gift_qty - totalGiftInCart) / rule.gift_qty)
        }else{
            // Remove gift from temp cart when canClaimCount < claimedCount
            if(canClaimCount < claimedCount && this.itemsInTempCart.size){
                let needToRemoveQty = (claimedCount - canClaimCount) * rule.gift_qty;
                Object.entries(giftIdMapQtyInTempCart).map(([giftId, quantity]) => {
                    if(needToRemoveQty > 0){
                        const giftData = this.giftsInTempCart.get(giftId);
                        const diffQty = needToRemoveQty - giftData.quantity;

                        if(diffQty > 0){
                            needToRemoveQty -= quantity;
                            giftData.quantity -= quantity;
                            delete giftData.ruleIdMapQty[ruleId];
                            
                        }else {
                            giftData.quantity -= needToRemoveQty;
                            giftData.ruleIdMapQty[ruleId] = quantity - needToRemoveQty;
                            needToRemoveQty = 0;
                        }
                        this.giftsInTempCart.set(giftId, giftData);

                        if(giftData.quantity <= 0){
                            this.giftsInTempCart.delete(giftId);
                        }
                    }
                })
            }
            // Case: canClaim =< claimed => Check next count
            let targetClaimCount = canClaimCount + 1;
            if(rule.maximum_per_order && targetClaimCount >= rule.maximum_per_order){
                targetClaimCount = rule.maximum_per_order
            }

            if(targetClaimCount > canClaimCount){
                if(rule.apply_condition_type === this.APPLY_CONDITION_TYPE.AMOUNT) {
                    remain = (rule.apply_condition_value  * this.currencyRate * targetClaimCount - totalProductApplied);
                }else {
                    remain = (rule.apply_condition_value * targetClaimCount - numberProductApplied);
                }

                if(rule.require_specific_qty){
                    parentRequiredQty.map((quantity, index) => {
                        if(parentQtyInCarts[index]){
                            remainSpecific += (quantity * targetClaimCount - parentQtyInCarts[index]) > 0 ? 
                                (quantity * targetClaimCount - parentQtyInCarts[index]) : 0;
                        }else {
                            remainSpecific += quantity * targetClaimCount
                        }
                    })
                }
            }else {
                conditionState = this.CONDITION_STATE.MET_AFTER_CLAIM;
            }
        }
        this.ruleIdMapConditionState.set(ruleId, conditionState);
        return [conditionState, claimedCount, canClaimCount, remain, remainSpecific]
    }

    updateSelectedGiftWithSameBuyOpt = (rule) => {
        const ruleId = rule.id;
        const parentInCart = this.ruleIdMapParentInCart.get(ruleId);

        if (parentInCart) {
            const cheapestParentInCart = Object.entries(parentInCart).reduce(
                (cheapest, [variantId, price]) => {
                    return price < cheapest.price ? { id: variantId, price } : cheapest;
                },
                { id: null, price: Number.MAX_VALUE }
            );

            if (cheapestParentInCart.id) {
                this.ruleIdMapSelectedGift.set(ruleId, {
                    [cheapestParentInCart.id]: rule.gift_qty,
                });
            }
        }
    }

    updateSelectedGifts = (rule) => {
        const ruleId = rule.id;
        if(rule.gift_type == this.GIFT_TYPE.SAME_BUY){
            this.updateSelectedGiftWithSameBuyOpt(rule);

            return true;
        }else {
            if(rule.auto_add_gift) {
                const listChildDisplayIds = [];
                const childMapRequiredQty = {}
                rule.listChilds.map(child =>{
                    listChildDisplayIds.push(child.shopify_id);
                    if(child.quantity){
                        childMapRequiredQty[child.shopify_id] = child.quantity;
                    }
                })
                if(rule.auto_add_type == this.AUTO_ADD_TYPE.FIRST_AVAILABLE){
                    for (let i = 0; i < listChildDisplayIds.length; i++) {
                        const giftId = listChildDisplayIds[i];
                        const giftData = this.shopifyIdMapData.get(giftId);
                        
                        if(giftData.available){
                            const selectedGift = {};
                            selectedGift[giftId] = rule.gift_qty;
                            this.ruleIdMapSelectedGift.set(ruleId, selectedGift);
                            break;
                        }
                    }
                }else{
                    this.ruleIdMapSelectedGift.set(ruleId, childMapRequiredQty);
                }
                return true;
            }
        }
        return false;
    }

    showConfetti = () => {
        const firework = new TLFreeGiftPopupNewFireworks();
        firework.partyTime();
    }

    toggleDismissWidgetStatus = (ruleId) => {
        let storedData = sessionStorage.getItem(this.SESSION_STORAGE);
        let sessionState = storedData ? JSON.parse(storedData) : { dismissStatus: {} };
    
        sessionState.dismissStatus[ruleId] = !sessionState.dismissStatus[ruleId];
    
        sessionStorage.setItem(this.SESSION_STORAGE, JSON.stringify(sessionState));
    };

    resetWidgetState = (ruleId) => {
        let storedData = sessionStorage.getItem(this.SESSION_STORAGE);
        let sessionState = storedData ? JSON.parse(storedData) : { dismissStatus: {} };
    
        if (sessionState.dismissStatus[ruleId]) {
            delete sessionState.dismissStatus[ruleId];
        }
    
        sessionStorage.setItem(this.SESSION_STORAGE, JSON.stringify(sessionState));
    };       

    render = async () => {        
        const bodyElement = document.querySelector(".salepify-fg-advanced-body");
        bodyElement.innerHTML = '<div class="loader"></div>'
        let bodyHtml = "";
        const listRuleNeedToAddGift = [];
        let availableToClaim = [];
        let needToReload = false
        let hasRuleMetCondition = false;

        const isGiftsOnlyLayout = this.#displaySettings.layout === this.POPUP_LAYOUT.GIFTS_ONLY;

        const sessionData = JSON.parse(sessionStorage.getItem(this.SESSION_STORAGE) || "{}");
        const dismissStatus = sessionData.dismissStatus || {};
        
        let unrenderedRules = this.#rules;

        if (isGiftsOnlyLayout) {
            unrenderedRules = this.#rules.filter(
                rule => !dismissStatus[rule.id] && !this.renderedRules.has(rule.id)
            );
        }        

        for (let i = 0; i < unrenderedRules.length; i++) {
            const rule = unrenderedRules[i];
            const ruleId = rule.id;
            const [conditionState, claimedCount, canClaimCount, remain, remainSpecific] = this.getRemain(rule);
            
            if(claimedCount < canClaimCount) {
                rule.auto_add_gift ? listRuleNeedToAddGift.push(ruleId) : null;
            }
            
            // Store handle of parent and child product
            const uniqueProductHandle = new Set();
            
            // Store list parent id in order current product => required => rest product 
            const listChildDisplayIds = [];
            // ChildId map quantity required
            const childMapRequiredQty = {};

            if(rule.gift_type == this.GIFT_TYPE.COLLECTION){

            }else {
                rule.listChilds.map(child =>{
                    listChildDisplayIds.push(child.shopify_id);
                    if(!this.shopifyIdMapData.get(child.product_id)){
                        uniqueProductHandle.add(child.handle)
                    }
                    if(child.quantity){
                        childMapRequiredQty[child.shopify_id] = child.quantity;
                    }
                })
            }
            
            // ParentId map quantity required
            const parentMapRequiredQty = {};

            const requireParents = []
            const highPriorityParents = [];
            const lowPriorityParents = [];
            const productIdKey = rule.apply_to_product === this.APPLY_TO_PRODUCT.PRODUCT ? "shopify_id" : "product_id";

            if(
                (rule.apply_to_product === this.APPLY_TO_PRODUCT.PRODUCT) ||
                (rule.apply_to_product === this.APPLY_TO_PRODUCT.VARIANT)
            ){
                rule.listParents.map(parent =>{
                    const productId = parent[productIdKey];
                    if(!this.shopifyIdMapData.get(productId)){
                        uniqueProductHandle.add(parent.handle);
                    }

                    if(productId == this.currentProductId){
                        parent.quantity ? requireParents.unshift(parent.shopify_id) : highPriorityParents.unshift(parent.shopify_id);
                    }else {
                        parent.quantity ? requireParents.push(parent.shopify_id) : lowPriorityParents.push(parent.shopify_id);
                    }
                    parentMapRequiredQty[parent.shopify_id] = parent.quantity;
                })
            }

            const listParentDisplayIds = [...requireParents, ...highPriorityParents, ...lowPriorityParents];
            await this.updateProductData(Array.from(uniqueProductHandle));
            if(rule.show_free_gift_widget && this.checkShowOnPage(rule.show_on_pages)){

                if(claimedCount < canClaimCount && !rule.auto_add_gift) {
                    hasRuleMetCondition = true;
                }
                const totalGift = rule.gift_qty * this.ruleIdMapCanClaimTime.get(ruleId);
                const ruleTranslation = this.getRuleTranslation(ruleId);
                const gifts = await this.getGifts(rule, listChildDisplayIds, childMapRequiredQty);

                if (isGiftsOnlyLayout) {
                    document.querySelector(".salepify-fg-advanced-header").classList.add("salepify-fg-advanced-header--gifts-only");
                    document.querySelector(".salepify-fg-advanced-header__title").innerHTML = ruleTranslation.title;
                    document.querySelector(".salepify-fg-advanced-header__subtitle").innerHTML = ruleTranslation.subtitle;

                    if (hasRuleMetCondition) {
                        bodyHtml += `
                            <div 
                                class="salepify-fg-advanced--gifts-only salepify-fg-advanced__main-section-container" 
                                id="salepify-fg-advanced__main-section-container-${ruleId}"
                            >
                                
                                <div class="salepify-fg-advanced__gift-container">
                                    ${this.renderGifts(rule, gifts, conditionState)}
                                </div>

                                <div class="salepify-fg-advanced__footer">
                                    <div class="salepify-fg-advanced__dismiss-toggler">
                                        <label class="salepify-fg-advanced__switch">
                                            <input 
                                                type="checkbox" 
                                                onChange="window.tlAdvancedFreeGift.toggleDismissWidgetStatus(${ruleId})"
                                            >
                                            <span class="salepify-fg-advanced__slider" />
                                        </label>
                                        <span class="salepify-fg-advanced__dismiss-help-text">${ruleTranslation.dismiss_help_text}</span>
                                    </div>

                                    ${
                                        conditionState === this.CONDITION_STATE.MET_BEFORE_CLAIM 
                                            ? `
                                                <div 
                                                    class="salepify-fg-advanced__claim-button" 
                                                    onclick="window.tlAdvancedFreeGift.handleAddGiftAndReload(${ruleId})"
                                                >
                                                    ${ruleTranslation.claim_btn}
                                                    (${conditionState !== this.CONDITION_STATE.MET_AFTER_CLAIM ? this.getTotalSelectedGift(ruleId) : totalGift}/${totalGift})
                                                </div>
                                            `
                                            : `<div class="salepify-fg-advanced__claim-button--claimed">Claimed</div>`
                                    }
                                </div>

                                <div id="salepify-fg-advanced-error-${ruleId}">
                                    <svg xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 512 512">
                                        <path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zm0-384c13.3 0 24 10.7 24 24V264c0 13.3-10.7 24-24 24s-24-10.7-24-24V152c0-13.3 10.7-24 24-24zM224 352a32 32 0 1 1 64 0 32 32 0 1 1 -64 0z"/>
                                    </svg>
                                    <span class="salepify-fg-advanced-error__message" />
                                </div>
                            </div>
                        `;

                        this.renderedRules.add(ruleId);
                        break;
                    }
                } else {
                    const headerTranslation = this.#translation.header;
                    document.querySelector(".salepify-fg-advanced-header__title").innerHTML = headerTranslation.title;
                    document.querySelector(".salepify-fg-advanced-header__subtitle").innerHTML = headerTranslation.subtitle;

                    bodyHtml += `
                        <div id="salepify-fg-advanced-main-section-${ruleId}"  
                            class="salepify-fg-advanced--detailed_list salepify-fg-advanced-main-section block--flex 
                                ${i == 0 ? "salepify-fg-advanced-main-section--view-more" : "salepify-fg-advanced-main-section--view-less"} 
                                ${conditionState !== this.CONDITION_STATE.NOT_MET ? "salepify-fg-advanced-main-section--allow-claim" : ""} 
                                ${conditionState === this.CONDITION_STATE.MET_AFTER_CLAIM ? "salepify-fg-advanced-main-section--claimed" : ""}">
                            <div class="block--flex-inline flex--space-between">
                                <div class="salepify-fg-advanced-main-section__offer-title">
                                    ${conditionState === this.CONDITION_STATE.NOT_MET 
                                        ? this.handleReplaceVariable(rule, this.getOfferTitle(rule), remain, remainSpecific, totalGift) 
                                        : ruleTranslation.main_offer.eligible_offer_title
                                    }
                                </div>
                                
                                <div class="salepify-fg-advanced-main-section__view-offer-btn btn--plain" 
                                    onclick='window.tlAdvancedFreeGift.handleViewMore("${ruleId}")'>
                                    ${i == 0 
                                        ? ruleTranslation.main_offer.view_less 
                                        : ruleTranslation.main_offer.view_more
                                    }
                                </div>
                            </div>

                            <div class="salepify-fg-advanced-offer block--flex-inline">
                                ${this.renderOffer(listParentDisplayIds)}
                            </div>

                            <div class="divider"></div>

                            <div class="salepify-fg-advanced-customer-buy block--flex block--collapsible">
                                ${this.renderCustomerBuy(listParentDisplayIds, parentMapRequiredQty)}
                            </div>

                            <div class="salepify-fg-advanced-main-section__upsell-banner">
                                ${this.handleReplaceVariable(
                                    rule, 
                                    this.renderUpsellMsg(conditionState, rule), 
                                    remain, 
                                    remainSpecific, 
                                    totalGift
                                )}
                            </div>

                            <div class="salepify-fg-advanced-gift-list block--flex block--collapsible"
                                ${rule.gift_type == this.GIFT_TYPE.COLLECTION 
                                    ? `onscroll="window.tlAdvancedFreeGift.handleLoadingGift(${ruleId})"` 
                                    : ""}>
                                ${this.renderGifts(rule, gifts, conditionState)}
                            </div>

                            <div class="salepify-fg-advanced-footer block--flex-inline flex--space-between block--collapsible"
                                style="display: ${(conditionState !== this.CONDITION_STATE.NOT_MET && !rule.auto_add_gift) ? "flex" : "none"}">
                                
                                <div class="salepify-fg-advanced-footer__remain-gift-title">
                                    ${ruleTranslation.manual_choose_gift.selected_text} 
                                    ${conditionState !== this.CONDITION_STATE.MET_AFTER_CLAIM 
                                        ? this.getTotalSelectedGift(ruleId) 
                                        : totalGift
                                    }/${totalGift}
                                </div>

                                ${
                                    conditionState === this.CONDITION_STATE.MET_BEFORE_CLAIM 
                                        ? `<div class="salepify-fg-advanced-footer__claim-btn btn--fake" 
                                            onclick='window.tlAdvancedFreeGift.handleAddGiftAndReload(${ruleId})'>
                                            ${ruleTranslation.manual_choose_gift.claim_btn}
                                        </div>`
                                        : `<div class="salepify-fg-advanced-footer__claim-btn 
                                                salepify-fg-advanced-footer__claim-btn--claimed">
                                            ${ruleTranslation.manual_choose_gift.claimed_btn}
                                        </div>`
                                }
                            </div>
                        </div>

                        <div id="salepify-fg-advanced-error-${ruleId}">
                            <svg xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 512 512">
                                <path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zm0-384c13.3 0 24 10.7 24 24V264c0 13.3-10.7 24-24 24s-24-10.7-24-24V152c0-13.3 10.7-24 24-24zM224 352a32 32 0 1 1 64 0 32 32 0 1 1 -64 0z"/>
                            </svg>
                            <span class="salepify-fg-advanced-error__message"></span>
                        </div>
                    `;
                }

                if(conditionState == this.CONDITION_STATE.MET_BEFORE_CLAIM) availableToClaim.push(ruleId);
            }else {
                needToReload = this.updateSelectedGifts(rule)
            }

            
            if (isGiftsOnlyLayout && hasRuleMetCondition) {
                break;
            }
        }

        if(listRuleNeedToAddGift.length){
            if(this.itemsInTempCart.size){
                listRuleNeedToAddGift.map((ruleId) => {
                    this.updateGiftsInTempCart(ruleId, true);
                })
            }else {
                const addCartReq = await this.handleAddGift(listRuleNeedToAddGift);
                if(addCartReq.status === 200){
                    if (this.displaySettings?.animation.show_confetti) {
                        this.showConfetti();
                    }
                    this.showIconPopUpMessage("You’ve received a gift. Please reload to view the changes.", availableToClaim.length)
                    if(needToReload) {
                        if(!window.TLCustomEventGiftsAdvanced){
                            tlPopupCartReRender();
                            return;
                        } else if (window.TLCustomEventGiftsAdvanced == 1) {
                            window.dispatchEvent(new CustomEvent("TLCustomEvent:FreeGiftsAdvanced-render-needToReload"));
                        }
                    };
                }else {
                    // Return error if there are not enough gift to add
                    const addCartRes = await addCartReq.json();
                    this.showIconPopUpMessage(addCartRes.description, 1)
                }
            }
        } else {
            if (availableToClaim.length && !isGiftsOnlyLayout) {
                const manualText = this.getRuleTranslation(availableToClaim[0]).gift_icon.manual
                this.showIconPopUpMessage(manualText, availableToClaim.length);
            } else {
                this.iconPopupBadgeElement.style = "display: none";
            }
        }

        if(bodyHtml) {
            const popupIcon = document.querySelector(".salepify-fg-advanced-icon-popup__icon");
            
            if (!isGiftsOnlyLayout) {
                popupIcon.style.display = this.#displaySettings.icon_popup.is_icon_displayed ? "block" : "none";
                this.iconPopupElement.style.display = "flex";
                this.iconPopupElement.style.backgroundImage = this.#displaySettings.icon_popup.is_icon_displayed
                    ? "none"
                    : `url(${this.#displaySettings.icon_popup.adv_free_gift_image.url})`;
            }
      
            bodyElement.innerHTML = bodyHtml;

            if (hasRuleMetCondition) {
                if (this.displaySettings?.animation.show_confetti) {
                    this.showConfetti();
                }
                this.openGiftModal();
                this.isAutoOpenPopup = true;
            }
        }
    }

    reRender = async () => {        
        const listRuleNeedToAddGift = [];
        let availableToClaim = [];
        let needToReload = false;
        let hasRuleMetCondition = false;

        const isGiftsOnlyLayout = this.#displaySettings.layout === this.POPUP_LAYOUT.GIFTS_ONLY;

        if (isGiftsOnlyLayout) {
            this.renderedRules = new Set();
        }

        const sessionData = JSON.parse(sessionStorage.getItem(this.SESSION_STORAGE) || "{}");
        const dismissStatus = sessionData.dismissStatus || {};
        
        let unrenderedRules = this.#rules;

        if (isGiftsOnlyLayout) {
            unrenderedRules = this.#rules.filter(
                rule => !dismissStatus[rule.id] && !this.renderedRules.has(rule.id)
            );
        }        

        for (let i = 0; i < unrenderedRules.length; i++) {
            const rule = unrenderedRules[i];
            const ruleId = rule.id;
            const [conditionState, claimedCount, canClaimCount, remain, remainSpecific] = this.getRemain(rule);
            
            if(claimedCount < canClaimCount) {
                rule.auto_add_gift ? listRuleNeedToAddGift.push(ruleId) : null;
            }

            // Store handle of parent and child product
            const uniqueProductHandle = new Set();
            
            // Store list parent id in order current product => required => rest product 
            const listChildDisplayIds = [];
            // ChildId map quantity required
            const childMapRequiredQty = {};

            if(rule.gift_type == this.GIFT_TYPE.COLLECTION){

            }else {
                rule.listChilds.map(child =>{
                    listChildDisplayIds.push(child.shopify_id);
                    if(!this.shopifyIdMapData.get(child.product_id)){
                        uniqueProductHandle.add(child.handle)
                    }
                    if(child.quantity){
                        childMapRequiredQty[child.shopify_id] = child.quantity;
                    }
                })
            }
            
            if(rule.show_free_gift_widget && this.checkShowOnPage(rule.show_on_pages)){
                if(claimedCount < canClaimCount && !rule.auto_add_gift) {
                    hasRuleMetCondition = true;
                }
                const totalGift = rule.gift_qty * this.ruleIdMapCanClaimTime.get(ruleId);
                const ruleTranslation = this.getRuleTranslation(ruleId);
                const mainSectionElement = document.querySelector(`#salepify-fg-advanced-main-section-${ruleId}`);
                const gifts = await this.getGifts(rule, listChildDisplayIds, childMapRequiredQty);

                if (isGiftsOnlyLayout) {
                    if (conditionState === this.CONDITION_STATE.NOT_MET && !rule.auto_add_gift) {
                        this.ruleIdMapSelectedGift.set(ruleId, {});
                    }

                    if (hasRuleMetCondition) {                        
                        document.querySelector(".salepify-fg-advanced-header__title").innerHTML = ruleTranslation.title;
                        document.querySelector(".salepify-fg-advanced-header__subtitle").innerHTML = ruleTranslation.subtitle;

                        const bodyHtml = `
                            <div 
                                class="salepify-fg-advanced--gifts-only salepify-fg-advanced__main-section-container" 
                                id="salepify-fg-advanced__main-section-container-${ruleId}"
                            >
                                
                                <div class="salepify-fg-advanced__gift-container">
                                    ${this.renderGifts(rule, gifts, conditionState)}
                                </div>

                                <div class="salepify-fg-advanced__footer">
                                    <div class="salepify-fg-advanced__dismiss-toggler">
                                        <label class="salepify-fg-advanced__switch">
                                            <input 
                                                type="checkbox" 
                                                onChange="window.tlAdvancedFreeGift.toggleDismissWidgetStatus(${ruleId})"
                                            >
                                            <span class="salepify-fg-advanced__slider" />
                                        </label>
                                        <span class="salepify-fg-advanced__dismiss-help-text">${ruleTranslation.dismiss_help_text}</span>
                                    </div>

                                    ${
                                        conditionState === this.CONDITION_STATE.MET_BEFORE_CLAIM 
                                            ? `
                                                <div 
                                                    class="salepify-fg-advanced__claim-button" 
                                                    onclick="window.tlAdvancedFreeGift.handleAddGiftAndReload(${ruleId})"
                                                >
                                                    ${ruleTranslation.claim_btn}
                                                    (${conditionState !== this.CONDITION_STATE.MET_AFTER_CLAIM ? this.getTotalSelectedGift(ruleId) : totalGift}/${totalGift})
                                                </div>
                                            `
                                            : `<div class="salepify-fg-advanced__claim-button--claimed">Claimed</div>`
                                    }

                                </div>

                                <div id="salepify-fg-advanced-error-${ruleId}">
                                    <svg xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 512 512">
                                        <path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zm0-384c13.3 0 24 10.7 24 24V264c0 13.3-10.7 24-24 24s-24-10.7-24-24V152c0-13.3 10.7-24 24-24zM224 352a32 32 0 1 1 64 0 32 32 0 1 1 -64 0z"/>
                                    </svg>
                                    <span class="salepify-fg-advanced-error__message"></span>
                                </div>
                            </div>
                        `;

                        document.querySelector(".salepify-fg-advanced-body").innerHTML = bodyHtml;

                        this.renderedRules.add(ruleId);
                        break;
                    }
                } else {
                    // Offer title
                    let offerTitleInnerHTML = ruleTranslation.main_offer.eligible_offer_title;
    
                    if(conditionState === this.CONDITION_STATE.NOT_MET){
                        // Set state main section
                        mainSectionElement.classList.remove("salepify-fg-advanced-main-section--allow-claim", "salepify-fg-advanced-main-section--claimed");
                    
                        offerTitleInnerHTML = this.handleReplaceVariable(rule, this.getOfferTitle(rule), remain, remainSpecific, totalGift);
                    }else if(conditionState === this.CONDITION_STATE.MET_BEFORE_CLAIM){
                        // Set state main section
                        mainSectionElement.classList.remove("salepify-fg-advanced-main-section--claimed");
                        mainSectionElement.classList.add("salepify-fg-advanced-main-section--allow-claim")
                    }else {
                        // Set state main section
                        mainSectionElement.classList.remove("salepify-fg-advanced-main-section--allow-claim");
                        mainSectionElement.classList.add("salepify-fg-advanced-main-section--claimed")
                    }
    
                    // Set innerHTML of offer_title
                    mainSectionElement.querySelector(".salepify-fg-advanced-main-section__offer-title").innerHTML = offerTitleInnerHTML;
    
                    // Set innerHTML of upsell_msg
                    mainSectionElement.querySelector(".salepify-fg-advanced-main-section__upsell-banner").innerHTML = this.handleReplaceVariable(
                        rule, 
                        this.renderUpsellMsg(conditionState, rule), 
                        remain, 
                        remainSpecific, 
                        totalGift
                    );
    
                    // Footer elment
                    const footerElment = mainSectionElement.querySelector(".salepify-fg-advanced-footer");
                    if(!rule.auto_add_gift && conditionState !== this.CONDITION_STATE.NOT_MET){
                        //Set footer style
                        footerElment.innerHTML = `
                            <div class="salepify-fg-advanced-footer__remain-gift-title">
                                ${ruleTranslation.manual_choose_gift.selected_text} 
                                ${conditionState !== this.CONDITION_STATE.MET_AFTER_CLAIM ?
                                    this.getTotalSelectedGift(ruleId) : totalGift
                                }/${totalGift}
                            </div>
                                
                            ${
                                conditionState === this.CONDITION_STATE.MET_BEFORE_CLAIM ? 
                                    `<div class="salepify-fg-advanced-footer__claim-btn btn--fake" 
                                        onclick='${this.itemsInTempCart.size > 0 ? 
                                            `window.tlAdvancedFreeGift.handleAddGiftToTempCart(${ruleId})`  :
                                            `window.tlAdvancedFreeGift.handleAddGiftAndReload(${ruleId})` 
                                        }'
                                    >
                                        ${ruleTranslation.manual_choose_gift.claim_btn}
                                    </div>` :
                                    `<div class="salepify-fg-advanced-footer__claim-btn salepify-fg-advanced-footer__claim-btn--claimed">
                                        ${ruleTranslation.manual_choose_gift.claimed_btn}
                                    </div> `
                            }
                        `;
                        footerElment.style.display = "flex";
                    }else {
                        footerElment.style.display = "none";
                    }
    
                    const listGiftElement = mainSectionElement.querySelectorAll(`div[id^="salepify-fg-advanced-gift-${ruleId}"]`);
    
                    listGiftElement.forEach((element) => {
                        const checkBoxElement = element.querySelector(".salepify-fg-advanced-checkbox");
                        const imageElement = element.querySelector(".salepify-fg-advanced-gift-info__img");
    
                        if(conditionState === this.CONDITION_STATE.MET_BEFORE_CLAIM){
                            if(!rule.auto_add_gift){
                                //Set show checkbox
                                checkBoxElement.classList.remove("salepify-fg-advanced-checkbox--hide");
                                checkBoxElement.classList.add("salepify-fg-advanced-checkbox--show");
                            }
    
                            // Set image
                            imageElement.classList.remove("salepify-fg-advanced-gift-info__img--condition-not-met");
                            imageElement.querySelector("svg").style.display = "none";
                        
                        }else {
                            //Set hide checkbox
                            checkBoxElement.classList.remove("salepify-fg-advanced-checkbox--show");
                            checkBoxElement.classList.add("salepify-fg-advanced-checkbox--hide");
                            element.querySelector(".salepify-fg-advanced-gift-qty-selector").style.display = "none";
    
                            // Set image
                            if(conditionState === this.CONDITION_STATE.NOT_MET){
                                imageElement.classList.add("salepify-fg-advanced-gift-info__img--condition-not-met");
                                imageElement.querySelector("svg").style.display = "block";
                                checkBoxElement.querySelector(".salepify-fg-advanced-checkbox__inp-cbx").checked = false;
        
                                if(!rule.auto_add_gift){
                                    this.ruleIdMapSelectedGift.set(ruleId, {}); 
                                }
                            }else {
                                imageElement.classList.remove("salepify-fg-advanced-gift-info__img--condition-not-met");
                                imageElement.querySelector("svg").style.display = "none";
                            }
                        }
                    })
    
                }

                if (conditionState === this.CONDITION_STATE.MET_BEFORE_CLAIM) {
                    availableToClaim.push(ruleId);
                }

                if (rule.gift_type === this.GIFT_TYPE.SAME_BUY) {
                    this.updateSelectedGiftWithSameBuyOpt(rule);
                }
            }else {
                needToReload = this.updateSelectedGifts(rule);
            }

            if (isGiftsOnlyLayout && hasRuleMetCondition) {
                break;
            }
        }

        if(listRuleNeedToAddGift.length){
            if(this.itemsInTempCart.size){
                listRuleNeedToAddGift.map((ruleId) => {
                    this.updateGiftsInTempCart(ruleId, true);
                })
            }else {
                const addCartReq = await this.handleAddGift(listRuleNeedToAddGift);
                if(addCartReq.status === 200){
                    if (this.displaySettings?.animation.show_confetti) {
                        this.showConfetti();
                    }
                    this.showIconPopUpMessage("You’ve received a gift. Please reload to view the changes.", availableToClaim.length);
                    if(needToReload) {
                        if(!window.TLCustomEventGiftsAdvanced){
                            tlPopupCartReRender();
                            return;
                        } else if (window.TLCustomEventGiftsAdvanced == 1) {
                            window.dispatchEvent(new CustomEvent("TLCustomEvent:FreeGiftsAdvanced-reRender-needToReload"));
                        }
                    };
                }else {
                    // Return error if there are not enough gift to add
                    const addCartRes = await addCartReq.json();
                    this.showIconPopUpMessage(addCartRes.description, 1)
                }
            }
        }else {
            if(availableToClaim.length && !isGiftsOnlyLayout){
                const manualText = this.getRuleTranslation(availableToClaim[0]).gift_icon.manual
                this.showIconPopUpMessage(manualText, availableToClaim.length);
            }else {
                // this.iconPopupBadgeElement.style = "display: none";
            }
        }

        this.renderTempCart();
        if(hasRuleMetCondition){
            if (!this.isAutoOpenPopup || (isGiftsOnlyLayout && this.isAutoOpenPopup)) {
                if (this.displaySettings?.animation.show_confetti) {
                    this.showConfetti();
                }
                this.openGiftModal();
                this.isAutoOpenPopup = true;
            }
        }
    }

    openTempCart = () => {
        const tempCartElement = document.querySelector(".salepify-fg-advanced-temp-cart");

        tempCartElement.classList.remove("salepify-fg-advanced-temp-cart--hide")
        tempCartElement.classList.add("salepify-fg-advanced-temp-cart--show")
    }
    
    closeTempCart = () => {
        const tempCartElement = document.querySelector(".salepify-fg-advanced-temp-cart");

        tempCartElement.classList.remove("salepify-fg-advanced-temp-cart--show");
        tempCartElement.classList.add("salepify-fg-advanced-temp-cart--hide");
    }

    renderTempCart = () => {
        const tempCartBodyElement = document.querySelector(".salepify-fg-advanced-temp-cart-body");

        let itemHtml = ``;
        
        Array.from(this.itemsInTempCart).map(([itemId, item]) => {
            const itemData = this.shopifyIdMapData.get(itemId);

            itemHtml += `
                <div class="salepify-fg-advanced-temp-cart-item">
                    <div class="salepify-fg-advanced-temp-cart-item__img">
                        <img src="${itemData.image}" alt="${itemData.title}" />
                    </div>
                    <p class="salepify-fg-advanced-temp-cart-item__quantity">
                        ${item.quantity}
                    </p>
                    <div class="salepify-fg-advanced-temp-cart-item__remove-btn btn--fake" onclick='window.tlAdvancedFreeGift.handleRemoveFromTempCart("${itemId}")'>
                        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M1 13L13 1M1 1L13 13" stroke="#9CA3AF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                    </div>
                </div>
            `;
        })

        let giftHtml = ``;
        
        Array.from(this.giftsInTempCart).map(([giftId, item]) => {
            const giftData = this.shopifyIdMapData.get(giftId);

            giftHtml += `
                <div class="salepify-fg-advanced-temp-cart-gift">
                    <div class="salepify-fg-advanced-temp-cart-gift__img">
                        <img src="${giftData.image}" alt="${giftData.title}" />
                    </div>
                    <p class="salepify-fg-advanced-temp-cart-gift__quantity">
                        ${item.quantity}
                    </p>
                    ${
                        !item.isAutoAdd ? `
                        <div class="salepify-fg-advanced-temp-cart-gift__remove-btn btn--fake" onclick='window.tlAdvancedFreeGift.handleRemoveGiftFromTempCart("${giftId}")'>
                            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M1 13L13 1M1 1L13 13" stroke="#9CA3AF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                        </div>`: ""
                    }
                    <div class="salepify-fg-advanced-temp-cart-gift__free-badge">${this.#translation.default.product_detail.free_text_content}</div>
                </div>
            `;
        })
        const bodyHtml = giftHtml ? 
            `${itemHtml} 
                <svg viewBox="0 0 14 14" width="14" height="14" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" clipRule="evenodd" d="M7 0.5C7.55228 0.5 8 0.947715 8 1.5V6.5H13C13.5523 6.5 14 6.94772 14 7.5C14 8.05228 13.5523 8.5 13 8.5H8V13.5C8 14.0523 7.55228 14.5 7 14.5C6.44772 14.5 6 14.0523 6 13.5V8.5H1C0.447715 8.5 0 8.05228 0 7.5C0 6.94771 0.447715 6.5 1 6.5L6 6.5V1.5C6 0.947715 6.44772 0.5 7 0.5Z" fill="#111827"/>
                </svg>
                ${giftHtml}
            ` : itemHtml;

        tempCartBodyElement.innerHTML = bodyHtml;
        bodyHtml ? this.openTempCart() : this.closeTempCart();
    }

    createAjaxCartErrorResponse = (statusCode, errMessage) => {
        return new Promise((resolve, reject) => {
            const response = new Response(JSON.stringify({ 
                errors: errMessage,
                description: errMessage,
                message: errMessage,
                status: statusCode
            }), {
                status: statusCode,
                headers: {
                    "Content-Type": "application/json"
                }
            });
            resolve(response);
        });
    }
}

const tlAdvancedFreeGiftOverride = () => {
    if (!window || !window.Shopify) return;
    const CartEvents = {
        add: "TLADVANCEDFG:add",
        update: "TLADVANCEDFG:update",
        change: "TLADVANCEDFG:change",
        clear: "TLADVANCEDFG:clear",
        mutate: "TLADVANCEDFG:mutate",
    };
    const ShopifyCartURLs = [
        "/cart/add",
        "/cart/update",
        "/cart/change",
        "/cart/add.js",
        "/cart/update.js",
        "/cart/change.js",
        "/cart/clear.js",
        "/cart/add.js?upcart=1&opens_cart=maybe"
    ];

    function isShopifyCartURL(url) {
        if(typeof URL == "function" && url instanceof URL) url = url.href;
        if(typeof url == "object" && url.url) url = url.url;
        if (!url || url.includes("app=salepify")) return false;

        try {
            let path = url.split("/").pop();
                path = path.split("?").shift();
            return ShopifyCartURLs.includes(`/cart/${path}`);
        } catch (e) {
            console.log("Not a normal URL: ", e)
            return false;
        }
    }

    function updateType(url) {
        if (!url || url.includes("app=salepify")) return false;
        if (url.includes("cart/add")) {
            return "add";
        } else if (url.includes("cart/update")) {
            return "update";
        } else if (url.includes("cart/change")) {
            return "change";
        } else if (url.includes("cart/clear")) {
            return "clear";
        } else return false;
    }

    function dispatchEvent(url, detail) {
        if (typeof detail === "string") {
            try {
                detail = JSON.parse(detail);
            } catch {
            }
        }
        window.dispatchEvent(new CustomEvent(CartEvents.mutate, {detail}));
        const type = updateType(url);
        switch (type) {
            case "add":
                window.dispatchEvent(new CustomEvent(CartEvents.add, {detail}));
                break;
            case "update":
                window.dispatchEvent(new CustomEvent(CartEvents.update, {detail}));
                break;
            case "change":
                window.dispatchEvent(new CustomEvent(CartEvents.change, {detail}));
                break;
            case "clear":
                window.dispatchEvent(new CustomEvent(CartEvents.clear, {detail}));
                break;
            default:
                break;
        }
    }

    function XHROverride() {
        if (!window.XMLHttpRequest) return;
        const originalOpen = window.XMLHttpRequest.prototype.open;
        window.XMLHttpRequest.prototype.open = function () {
            const url = arguments[1];
            this.addEventListener("load", function () {
                if (isShopifyCartURL(url)) {
                    dispatchEvent(url, this.response);
                }
            });
            return originalOpen.apply(this, arguments);
        };
    }

    function fetchOverride() {        
        if (!window.fetch || typeof window.fetch !== "function") return;
        const originalFetch = window.fetch;
        window.fetch = async function () {            
            let [resource, config] = [...arguments];
            if (isShopifyCartURL(resource) && config && config.body && config.body !== "{}") {
                const cartDataReq = await originalFetch('/cart.js', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                const cartDataRes = await cartDataReq.json();

                let itemId = null;
                let quantity = 1;
                // Check if this line is gift line
                let lineChangeIsGift = null;
                let isChangeCartLine = false;
                // Case: Add to cart
                if(resource.includes('add')){
                    // Body type is FormData
                    if(config.body instanceof FormData && config.body.getAll("id")){
                        itemId = String(config.body.getAll("id"));
                        quantity = Number(config.body.getAll("quantity")) ? Number(config.body.getAll("quantity")) : 1
                    }else {
                        // Body is a string 
                        const allRequestBody = config.body.split("&");
                        if (allRequestBody.length) {
                            allRequestBody.map(param => {
                                if (param) {
                                    const paramArray = param.split('=');
                                    if (paramArray.length > 1) {
                                        if (paramArray[0] === "id") {
                                            itemId = String(paramArray[1]);
                                        } else if (paramArray[0] === "quantity") {
                                            quantity = paramArray[1] ? Number(paramArray[1]) : 1;
                                        }
                                    } else if (window.tlAdvancedFreeGift.isJson(param)) {
                                        const paramObj = JSON.parse(param);
                                        if(paramObj.id){
                                            itemId = String(paramObj.id);
                                            quantity = paramObj.quantity ? Number(paramObj.quantity) : 1;
                                        }else if(paramObj.items){
                                            const item = paramObj.items[0];
                                            itemId = String(item.id);
                                            quantity = item.quantity ? Number(item.quantity) : 1;
                                        }
                                    }
                                }
                            })
                        }
                    }
                }else {
                    // Case: Change or Update cart
                    isChangeCartLine = true;
                    let items = JSON.parse(JSON.stringify(cartDataRes.items));
                    let lineChangeIndex = null;
                    const bodyArgument = JSON.parse(config.body);
                    let newLineQty = Number(bodyArgument.quantity);
                    if(bodyArgument.line){
                        lineChangeIndex = Number(bodyArgument.line) - 1;
                    }else if(bodyArgument.id){
                        items.map((item, index) => {
                            if(item.key === bodyArgument.id){
                                lineChangeIndex =  index;
                            }
                        });
                    }else if(bodyArgument.updates) {
                        const updates = bodyArgument.updates;
                        if(items.length === 0){
                            const response = originalFetch.apply(this, arguments);
                            response.then((res) => {
                                    res
                                        .clone()
                                        .json()
                                        .then((data) => dispatchEvent(res.url, data));
                            });
                            return response
                        }
                        items.map((item, index) => {
                            if(updates[item.key] && item.quantity !== Number(updates[item.key])){
                                lineChangeIndex =  index;
                                newLineQty = Number(updates[item.key])
                            }
                            if(Object.keys(updates) &&  Object.keys(updates).length){
                                if(item.id == Object.keys(updates)[0]){
                                    lineChangeIndex =  index;                          
                                    newLineQty = updates[`${item.id}`]
                                }
                            }
                        });
                       
                    }
                    // Fix for empire theme - With change.js APIs, it only updates the property without updating the line item.
                    // There is no id to find the line item, return the original fetch response.
                    if (lineChangeIndex === null) return originalFetch.apply(this, arguments);

                    const changeItem = items[lineChangeIndex];
                    
                    let ruleIdApplyToItem = null;
                    
                    // Get discount id base on discount applying
                    changeItem.discounts.find(discount => {
                        if (window.tlAdvancedFreeGift.discountCodeMapRuleId.get(discount.title)) {
                            ruleIdApplyToItem = window.tlAdvancedFreeGift.discountCodeMapRuleId.get(discount.title);
                            return true
                        }
                    })
                    if(!ruleIdApplyToItem) {
                        // Case: there is no discount apply => check base on property in line item
                        ruleIdApplyToItem = changeItem.properties[window.tlAdvancedFreeGift.PROPERTY]
                    }

                    if(ruleIdApplyToItem && (changeItem.price == 0 || changeItem.total_discount > 0)){
                        lineChangeIsGift = ruleIdApplyToItem
                        const ruleData = window.tlAdvancedFreeGift.ruleIdMapData.get(ruleIdApplyToItem);

                        if(ruleData && ruleData.prevent_change_gift_qty){
                            const errMessage = `You can't add more ${changeItem.quantity} ${changeItem.title} to the cart.`;
                            return window.tlAdvancedFreeGift.createAjaxCartErrorResponse(422, errMessage)
                        }
                    }
                    itemId = String(changeItem.key);
                    if(newLineQty > 0){
                        quantity = newLineQty - changeItem.quantity;
                    }else {
                        quantity = - changeItem.quantity;
                    }
                    if (quantity == 0) return originalFetch.apply(this, arguments);
                }

                const variantId = itemId.split(":")[0];
                // Check inventory quantity of variant
                if(window.tlAdvancedFreeGift.variantIdMapInventory){
                    const itemInventory = window.tlAdvancedFreeGift.variantIdMapInventory.get(variantId);
                    if(itemInventory){
                        if(!itemInventory.available) {
                            return originalFetch.apply(this, arguments);
                        }else {
                            const totalVariantIdInCart = cartDataRes.items.reduce((sum, item) => sum + (item.id == variantId ? item.quantity : 0), 0);
                            const quantityAfterChange = quantity + totalVariantIdInCart;
                            if(itemInventory.inventory_quantity !==0 && quantityAfterChange > itemInventory.inventory_quantity){
                                quantity = itemInventory.inventory_quantity - totalVariantIdInCart;
                                if(quantity <= 0) {
                                    return originalFetch.apply(this, arguments);
                                }
                            }
                        }
                    }
                }

                // If the line change is a gift, it will update the quantity of gifts in the cart for calculation.
                if(lineChangeIsGift && quantity < 0){
                    const currentGiftQtyInCart = window.tlAdvancedFreeGift.ruleIdMapGiftQtyInCart.get(lineChangeIsGift);
                    if(currentGiftQtyInCart) {
                        window.tlAdvancedFreeGift.ruleIdMapGiftQtyInCart.set(lineChangeIsGift, currentGiftQtyInCart + quantity)
                    }
                }else {
                    let itemData = window.tlAdvancedFreeGift.itemsInCart.get(itemId);
                    if(itemData){
                        window.tlAdvancedFreeGift.itemsInCart.set(itemId, {
                            ...itemData,
                            quantity: itemData.quantity + quantity > 0 ? itemData.quantity + quantity : 0
                        })
                    }else {
                        itemData = await window.tlAdvancedFreeGift.getVariantData(itemId);
                        if(itemData){
                            const productId = itemData.product.id.split("/").pop();
                            window.tlAdvancedFreeGift.itemsInCart.set(itemId, {
                                id: itemId,
                                price: parseFloat(itemData.price.amount) * window.tlAdvancedFreeGift.currencyRate,
                                quantity: quantity ,
                                productId: productId,
                                collectionIds: window.tlAdvancedFreeGift.productIdMapCollection.get(productId)
                            })
                        }
                    }
                }

                const listRuleNeedToAddGift = [];
                const listRuleNeedToRemoveGift = [];
                window.tlAdvancedFreeGift.rules.map(rule => {
                    if(rule.auto_add_gift || rule.auto_remove_gift){
                        const ruleId = rule.id;
                        const [conditionState, claimedCount, canClaimCount] = window.tlAdvancedFreeGift.getRemain(rule);
            
                        if(claimedCount < canClaimCount) {
                            rule.auto_add_gift ? listRuleNeedToAddGift.push(ruleId) : null;
                        }else if(claimedCount > canClaimCount){
                            rule.auto_remove_gift ? listRuleNeedToRemoveGift.push({
                                id: ruleId,
                                removeTime: claimedCount - canClaimCount
                            }): null;
                        }
                        // Update gift selected with same buy option
                        if (rule.gift_type == window.tlAdvancedFreeGift.GIFT_TYPE.SAME_BUY) {
                            window.tlAdvancedFreeGift.updateSelectedGiftWithSameBuyOpt(rule);
                        }
                    }
                })

                let isAddOrRemove = false;
                //Add gift
                if(listRuleNeedToAddGift.length){
                    isAddOrRemove = true;
                    await window.tlAdvancedFreeGift.handleAddGift(listRuleNeedToAddGift);
                    if (window.tlAdvancedFreeGift.displaySettings?.animation.show_confetti) {
                        window.tlAdvancedFreeGift.showConfetti();
                    }

                    // Show notification earned gift
                    if(window.tlNotificationPopup){
                        window.tlAdvancedFreeGift.giftAddedImg.forEach((imgSrc) => window.tlNotificationPopup.showNoti(imgSrc))
                    }

                    if (window.tlAdvancedFreeGift.displaySettings.layout !== "gifts_only") {
                        const translation = window.tlAdvancedFreeGift.translation[listRuleNeedToAddGift[0]]
                            ? window.tlAdvancedFreeGift.translation[listRuleNeedToAddGift[0]]
                            : window.tlAdvancedFreeGift.translation.default;
    
                        window.tlAdvancedFreeGift.showIconPopUpMessage(translation.gift_icon.auto, listRuleNeedToAddGift.length);
                    }
                } 

                //Remove gift
                if(listRuleNeedToRemoveGift.length){
                    isAddOrRemove = true;
                    await window.tlAdvancedFreeGift.handleRemoveGift(listRuleNeedToRemoveGift);

                    window.tlAdvancedFreeGift.iconPopupBadgeElement.style = "display: none";
                }

                // If fetch is change.js and removed or added gift  => Update line and quantity 
                if(isChangeCartLine && isAddOrRemove){
                    const cartDataReq = await originalFetch('/cart.js', {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    });
                    const cartDataRes = await cartDataReq.json();
                    // Update new data to original fetch - cart/change
                    const dataUpdate = {
                        line: 0,
                        quantity: 0
                    }

                    const itemIdPrefix = itemId.split(":").shift();
                    let diffQty = quantity;
                    
                    // Body of new api cart/update.js
                    const updates = {};
                    // Get line item change in original fetch by item key OR variant id and has no gift property
                    const currentItemChange = cartDataRes.items.find(item => {
                        const giftProperty = item.properties[window.tlAdvancedFreeGift.PROPERTY];
                        return item.key == itemId || (item.id == itemIdPrefix && !giftProperty)  
                    });

                    diffQty += currentItemChange.quantity
                    updates[currentItemChange.key] = String(diffQty < 0 ? 0 : diffQty);

                    // Check if the product quantity change is less than 0, then adjust the quantity of 
                    // products with variant IDs matching the changed line item to the correct amount.
                    for (let i = 0; i < cartDataRes.items.length; i++) {
                        const item = cartDataRes.items[i];
                        if(diffQty >= 0) break;

                        if(item.id == itemIdPrefix && !updates[item.key]){
                            diffQty += item.quantity
                            updates[item.key] = String(diffQty < 0 ? 0 : diffQty);
                        }
                    }

                    const bodyArgument = JSON.parse(config.body); 
                    // Check if the original fetch does not have the attribute `{{updates}}` in the body.
                    if(!bodyArgument.updates) {
                        // This API will update the quantity in the cart, replacing the original fetch.
                        // Because there will be cases that require updating multiple line items, 
                        // the original `fetch cart/change` can only update one line at a time.
                        const updateReq = await fetch(window.Shopify.routes.root + 'cart/update.js?app=salepify', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({ updates })
                        });

                        const updateRes = await updateReq.json();

                        if(updateRes.items.length){
                            if(bodyArgument.id) {
                                dataUpdate.id = updateRes.items[0].key
                            }
                            dataUpdate.line = 1;
                            dataUpdate.quantity = String(updateRes.items[0].quantity);
                        }
                    }

                    arguments[1].body = JSON.stringify({
                        ...bodyArgument,
                        updates: bodyArgument.updates ? updates : undefined,
                        ...dataUpdate
                    })
                }

                const response = originalFetch.apply(this, arguments);

                response.then((res) => {
                    res
                        .clone()
                        .json()
                        .then((data) => dispatchEvent(res.url, data));
                });
                return response;
            } else {
                return originalFetch.apply(this, arguments);
            }
        };
    }

    window.addEventListener('TLADVANCEDFG:add', () => {
        window.tlAdvancedFreeGift.updateCartData()
    })

    window.addEventListener('TLADVANCEDFG:change', () => {
        window.tlAdvancedFreeGift.updateCartData()
    })

    window.addEventListener('TLADVANCEDFG:update', () => {
        window.tlAdvancedFreeGift.updateCartData()
    })

    fetchOverride();
    XHROverride();
};

!function (t, e) {
    !function t(e, n, a, i) {
        var o = !!(e.Worker && e.Blob && e.Promise && e.OffscreenCanvas && e.OffscreenCanvasRenderingContext2D && e.HTMLCanvasElement && e.HTMLCanvasElement.prototype.transferControlToOffscreen && e.URL && e.URL.createObjectURL);

        function r() {
        }

        function l(t) {
            var a = n.exports.Promise, i = void 0 !== a ? a : e.Promise;
            return "function" == typeof i ? new i(t) : (t(r, r), null)
        }

        var c, s, u, d, f, h, g, m,
            b = (u = Math.floor(1e3 / 60), d = {}, f = 0, "function" == typeof requestAnimationFrame && "function" == typeof cancelAnimationFrame ? (c = function (t) {
                var e = Math.random();
                return d[e] = requestAnimationFrame((function n(a) {
                    f === a || f + u - 1 < a ? (f = a, delete d[e], t()) : d[e] = requestAnimationFrame(n)
                })), e
            }, s = function (t) {
                d[t] && cancelAnimationFrame(d[t])
            }) : (c = function (t) {
                return setTimeout(t, u)
            }, s = function (t) {
                return clearTimeout(t)
            }), {frame: c, cancel: s}), v = (m = {}, function () {
                if (h) return h;
                if (!a && o) {
                    var e = ["var CONFETTI, SIZE = {}, module = {};", "(" + t.toString() + ")(this, module, true, SIZE);", "onmessage = function(msg) {", "  if (msg.data.options) {", "    CONFETTI(msg.data.options).then(function () {", "      if (msg.data.callback) {", "        postMessage({ callback: msg.data.callback });", "      }", "    });", "  } else if (msg.data.reset) {", "    CONFETTI.reset();", "  } else if (msg.data.resize) {", "    SIZE.width = msg.data.resize.width;", "    SIZE.height = msg.data.resize.height;", "  } else if (msg.data.canvas) {", "    SIZE.width = msg.data.canvas.width;", "    SIZE.height = msg.data.canvas.height;", "    CONFETTI = module.exports.create(msg.data.canvas);", "  }", "}"].join("\n");
                    try {
                        h = new Worker(URL.createObjectURL(new Blob([e])))
                    } catch (t) {
                        return void 0 !== typeof console && "function" == typeof console.warn && console.warn("🎊 Could not load worker", t), null
                    }
                    !function (t) {
                        function e(e, n) {
                            t.postMessage({options: e || {}, callback: n})
                        }

                        t.init = function (e) {
                            var n = e.transferControlToOffscreen();
                            t.postMessage({canvas: n}, [n])
                        }, t.fire = function (n, a, i) {
                            if (g) return e(n, null), g;
                            var o = Math.random().toString(36).slice(2);
                            return g = l((function (a) {
                                function r(e) {
                                    e.data.callback === o && (delete m[o], t.removeEventListener("message", r), g = null, i(), a())
                                }

                                t.addEventListener("message", r), e(n, o), m[o] = r.bind(null, {data: {callback: o}})
                            }))
                        }, t.reset = function () {
                            for (var e in t.postMessage({reset: !0}), m) m[e](), delete m[e]
                        }
                    }(h)
                }
                return h
            }), y = {
                particleCount: 50,
                angle: 90,
                spread: 45,
                startVelocity: 45,
                decay: .9,
                gravity: 1,
                drift: 0,
                ticks: 200,
                x: .5,
                y: .5,
                shapes: ["square", "circle"],
                zIndex: 100,
                colors: ["#26ccff", "#a25afd", "#ff5e7e", "#88ff5a", "#fcff42", "#ffa62d", "#ff36ff"],
                disableForReducedMotion: !1,
                scalar: 1
            };

        function p(t, e, n) {
            return function (t, e) {
                return e ? e(t) : t
            }(t && null != t[e] ? t[e] : y[e], n)
        }

        function M(t) {
            return t < 0 ? 0 : Math.floor(t)
        }

        function w(t) {
            return parseInt(t, 16)
        }

        function x(t) {
            return t.map(C)
        }

        function C(t) {
            var e = String(t).replace(/[^0-9a-f]/gi, "");
            return e.length < 6 && (e = e[0] + e[0] + e[1] + e[1] + e[2] + e[2]), {
                r: w(e.substring(0, 2)),
                g: w(e.substring(2, 4)),
                b: w(e.substring(4, 6))
            }
        }

        function k(t) {
            t.width = document.documentElement.clientWidth, t.height = document.documentElement.clientHeight
        }

        function I(t) {
            var e = t.getBoundingClientRect();
            t.width = e.width, t.height = e.height
        }

        function T(t, e, n, o, r) {
            var c, s, u = e.slice(), d = t.getContext("2d"), f = l((function (e) {
                function l() {
                    c = s = null, d.clearRect(0, 0, o.width, o.height), r(), e()
                }

                c = b.frame((function e() {
                    !a || o.width === i.width && o.height === i.height || (o.width = t.width = i.width, o.height = t.height = i.height), o.width || o.height || (n(t), o.width = t.width, o.height = t.height), d.clearRect(0, 0, o.width, o.height), (u = u.filter((function (t) {
                        return function (t, e) {
                            e.x += Math.cos(e.angle2D) * e.velocity + e.drift, e.y += Math.sin(e.angle2D) * e.velocity + e.gravity, e.wobble += .1, e.velocity *= e.decay, e.tiltAngle += .1, e.tiltSin = Math.sin(e.tiltAngle), e.tiltCos = Math.cos(e.tiltAngle), e.random = Math.random() + 5, e.wobbleX = e.x + 10 * e.scalar * Math.cos(e.wobble), e.wobbleY = e.y + 10 * e.scalar * Math.sin(e.wobble);
                            var n = e.tick++ / e.totalTicks, a = e.x + e.random * e.tiltCos,
                                i = e.y + e.random * e.tiltSin, o = e.wobbleX + e.random * e.tiltCos,
                                r = e.wobbleY + e.random * e.tiltSin;
                            return t.fillStyle = "rgba(" + e.color.r + ", " + e.color.g + ", " + e.color.b + ", " + (1 - n) + ")", t.beginPath(), "circle" === e.shape ? t.ellipse ? t.ellipse(e.x, e.y, Math.abs(o - a) * e.ovalScalar, Math.abs(r - i) * e.ovalScalar, Math.PI / 10 * e.wobble, 0, 2 * Math.PI) : function (t, e, n, a, i, o, r, l, c) {
                                t.save(), t.translate(e, n), t.rotate(o), t.scale(a, i), t.arc(0, 0, 1, r, l, c), t.restore()
                            }(t, e.x, e.y, Math.abs(o - a) * e.ovalScalar, Math.abs(r - i) * e.ovalScalar, Math.PI / 10 * e.wobble, 0, 2 * Math.PI) : (t.moveTo(Math.floor(e.x), Math.floor(e.y)), t.lineTo(Math.floor(e.wobbleX), Math.floor(i)), t.lineTo(Math.floor(o), Math.floor(r)), t.lineTo(Math.floor(a), Math.floor(e.wobbleY))), t.closePath(), t.fill(), e.tick < e.totalTicks
                        }(d, t)
                    }))).length ? c = b.frame(e) : l()
                })), s = l
            }));
            return {
                addFettis: function (t) {
                    return u = u.concat(t), f
                }, canvas: t, promise: f, reset: function () {
                    c && b.cancel(c), s && s()
                }
            }
        }

        function E(t, n) {
            var a, i = !t, r = !!p(n || {}, "resize"), c = p(n, "disableForReducedMotion", Boolean),
                s = o && !!p(n || {}, "useWorker") ? v() : null, u = i ? k : I,
                d = !(!t || !s) && !!t.__confetti_initialized,
                f = "function" == typeof matchMedia && matchMedia("(prefers-reduced-motion)").matches;

            function h(e, n, i) {
                for (var o, r, l, c, s, d = p(e, "particleCount", M), f = p(e, "angle", Number), h = p(e, "spread", Number), g = p(e, "startVelocity", Number), m = p(e, "decay", Number), b = p(e, "gravity", Number), v = p(e, "drift", Number), y = p(e, "colors", x), w = p(e, "ticks", Number), C = p(e, "shapes"), k = p(e, "scalar"), I = function (t) {
                    var e = p(t, "origin", Object);
                    return e.x = p(e, "x", Number), e.y = p(e, "y", Number), e
                }(e), E = d, S = [], F = t.width * I.x, N = t.height * I.y; E--;) S.push((o = {
                    x: F,
                    y: N,
                    angle: f,
                    spread: h,
                    startVelocity: g,
                    color: y[E % y.length],
                    shape: C[(c = 0, s = C.length, Math.floor(Math.random() * (s - c)) + c)],
                    ticks: w,
                    decay: m,
                    gravity: b,
                    drift: v,
                    scalar: k
                }, r = void 0, l = void 0, r = o.angle * (Math.PI / 180), l = o.spread * (Math.PI / 180), {
                    x: o.x,
                    y: o.y,
                    wobble: 10 * Math.random(),
                    velocity: .5 * o.startVelocity + Math.random() * o.startVelocity,
                    angle2D: -r + (.5 * l - Math.random() * l),
                    tiltAngle: Math.random() * Math.PI,
                    color: o.color,
                    shape: o.shape,
                    tick: 0,
                    totalTicks: o.ticks,
                    decay: o.decay,
                    drift: o.drift,
                    random: Math.random() + 5,
                    tiltSin: 0,
                    tiltCos: 0,
                    wobbleX: 0,
                    wobbleY: 0,
                    gravity: 3 * o.gravity,
                    ovalScalar: .6,
                    scalar: o.scalar
                }));
                return a ? a.addFettis(S) : (a = T(t, S, u, n, i)).promise
            }

            function g(n) {
                var o = c || p(n, "disableForReducedMotion", Boolean), g = p(n, "zIndex", Number);
                if (o && f) return l((function (t) {
                    t()
                }));
                i && a ? t = a.canvas : i && !t && (t = function (t) {
                    var e = document.createElement("canvas");
                    return e.style.position = "fixed", e.style.top = "0px", e.style.left = "0px", e.style.pointerEvents = "none", e.style.zIndex = t, e
                }(g), document.body.appendChild(t)), r && !d && u(t);
                var m = {width: t.width, height: t.height};

                function b() {
                    if (s) {
                        var e = {
                            getBoundingClientRect: function () {
                                if (!i) return t.getBoundingClientRect()
                            }
                        };
                        return u(e), void s.postMessage({resize: {width: e.width, height: e.height}})
                    }
                    m.width = m.height = null
                }

                function v() {
                    a = null, r && e.removeEventListener("resize", b), i && t && (document.body.removeChild(t), t = null, d = !1)
                }

                return s && !d && s.init(t), d = !0, s && (t.__confetti_initialized = !0), r && e.addEventListener("resize", b, !1), s ? s.fire(n, m, v) : h(n, m, v)
            }

            return g.reset = function () {
                s && s.reset(), a && a.reset()
            }, g
        }

        n.exports = E(null, {useWorker: !0, resize: !0}), n.exports.create = E
    }(function () {
        return void 0 !== t ? t : "undefined" != typeof self ? self : this || {}
    }(), e, !1), t.confetti = e.exports
}(window, {});

class TLFreeGiftPopupNewFireworks {
    constructor() {
        this.isAnimating = false;
        this.bindedAnimate = this.animate.bind(this);
    }

    connectedCallback() {
        this.addEventListener('click', this.partyTime)
    }

    partyTime() {
        const end = Date.now() + (2000);

        if (this.isAnimating) return;
        this.animate(end);
    }

    animate(end) {
        confetti({
            particleCount: 3,
            angle: 60,
            spread: 55,
            origin: {x: 0}
        });
        confetti({
            particleCount: 3,
            angle: 120,
            spread: 55,
            origin: {x: 1}
        });

        if (Date.now() < end) {
            this.isAnimating = true;
            requestAnimationFrame(() => this.animate(end));
        } else {
            this.isAnimating = false;
        }
    }
}

window.customElements.define('tl-free-gift-popup-new-fireworks', TLFreeGiftPopupNewFireworks, {extends: "button"})

window.tlAdvancedFreeGift =  window.tlAdvancedFreeGift || new tlAdvancedFreeGift(
    tlAdvancedFGIsRestricted,
    tlAdvancedFGTemplate,
    tlAdvancedFGFormatMoney, 
    tlAdvancedFGDefaultImage,
    tlAdvancedFGOfferImage,
    tlAdvancedFGUpdateState,
    tlAdvancedFGDisplaySetting,
    tlAdvancedFGProductId,
    tlAdvancedFGCollectionsOfProduct,
    tlAdvancedFGProductIdMapCollection,
    tlAdvancedFGProductVariantIds,
    tlAdvancedFGProductVariantIdMapInventory,
    tlAdvancedFGCustomer,
    tlAdvancedFGTranslation
);