

import React, { useState, useRef, useEffect } from "react";
import ReactDOM from "react-dom";
import { Button, Form, Tabs, Tab } from "react-bootstrap";

/* =========================
   Wizard Nav Item
========================= */

export function WizardNavItem(props) {
    const { cur, index, className, onClick } = props;

    function goToPage(e) {
        e.preventDefault();
        if (cur !== index) onClick(index);
    }

    return (
        <li
            className={`nav-item ${cur === index ? "active" : cur > index ? "completed" : ""
                }`}
        >
            <a
                href="#wizardNav"
                className={`nav-link${className ? ` ${className}` : ""}`}
                onClick={goToPage}
            >
                {props.children}
            </a>
        </li>
    );
}

WizardNavItem.displayName = "WizardNavItem";

/* =========================
   Wizard Nav
========================= */

export function WizardNav(props) {
    const { className, children, curPage, pageChange, container } = props;
    const items = children.filter(
        (child) => child.type.displayName === "WizardNavItem"
    );

    const content = (
        <ul className={`nav${className ? ` ${className}` : ""}`}>
            {items.map((item, index) => (
                <WizardNavItem
                    key={`nav-${index}`}
                    cur={curPage}
                    index={index}
                    onClick={pageChange}
                    {...item.props}
                />
            ))}
        </ul>
    );

    useEffect(() => {
        if (container) {
            const el = document.getElementById(container);
            if (el) ReactDOM.render(content, el);
        }
    }, [curPage]);

    return container ? null : content;
}

WizardNav.displayName = "WizardNav";

/* =========================
   Wizard Pager
========================= */

export function WizardPager(props) {
    const { current, total, onPrev, onNext, onFinish, container } = props;

    const content = (
        <ul className="pager">
            <li className={`previous ${current === 0 ? "disabled" : ""}`}>
                <Button href="#prev" variant="default" onClick={onPrev}>
                    <i className="fas fa-angle-left" /> Previous
                </Button>
            </li>

            {current < total - 1 ? (
                <li className="next">
                    <Button href="#next" variant="default" onClick={onNext}>
                        Next <i className="fas fa-angle-right" />
                    </Button>
                </li>
            ) : (
                <li className="finish float-right">
                    <Button
                        href="#finish"
                        variant="default"
                        style={{ background: "#FF600F", color: "#fff" }}
                        onClick={onFinish}
                    >
                        Finish
                    </Button>
                </li>
            )}
        </ul>
    );

    useEffect(() => {
        if (container) {
            const el = document.getElementById(container);
            if (el) ReactDOM.render(content, el);
        }
    }, [current]);

    return container ? null : content;
}

/* =========================
   Wizard Tab
========================= */

export function WizardTab(props) {
    return props.children;
}

WizardTab.displayName = "WizardTab";

/* =========================
   Wizard Progress
========================= */

const WizardProgress = ({ curPage, total, size, children }) => {
    const classNames = () => {
        let temp = ["wizard-progress"];
        size && temp.push(`wizard-progress-${size}`);
        return temp.join(" ");
    };

    return (
        <div className={classNames()}>
            <div className="steps-progress">
                <div
                    className="progress-indicator"
                    style={{
                        width: `${((100 * curPage) / (total - 1)).toFixed(1)}%`,
                    }}
                />
            </div>
            {children}
        </div>
    );
};

/* =========================
   MAIN WIZARD
========================= */

export default function Wizard(props) {
    const {
        onFinish,
        pagerContainer,
        className,
        navContainer,
        showProgress = false,
        Progress = WizardProgress,
        progressSize,

        /* ✅ CONTROL SUPPORT */
        initialPage = 0,
        page,
        onPageChange,
        stepIndex,
        onStepChange,
    } = props;

    const [validated, setValidated] = useState(false);

    const tabs = props.children.filter(
        (child) => child.type.displayName === "WizardTab"
    );
    const nav = props.children.find(
        (child) => child.type.displayName === "WizardNav"
    );

    const clamp = (n) =>
        Math.max(0, Math.min(Number(n) || 0, tabs.length - 1));

    const controlledPage =
        stepIndex !== undefined ? stepIndex : page;
    const controlledSetter = onStepChange || onPageChange;

    const [curPage, setCurPage] = useState(() =>
        clamp(controlledPage ?? initialPage)
    );

    const formRef = useRef(null);

    /* 🔁 Sync when parent updates stepIndex */
    useEffect(() => {
        if (controlledPage !== undefined) {
            setCurPage(clamp(controlledPage));
        }
    }, [controlledPage, tabs.length]);

    const setPage = (p) => {
        const next = clamp(p);
        setCurPage(next);
        controlledSetter?.(next);
    };

    useEffect(() => {
        setValidated(false);
    }, [curPage]);

    async function checkPageFormikValidation(pageIndex) {
        const formik = props.validators?.[pageIndex];
        if (!formik) return true;

        const errors = await formik.validateForm();

        formik.setTouched(
            Object.keys(formik.initialValues).reduce((acc, key) => {
                acc[key] = true;
                return acc;
            }, {})
        );

        return Object.keys(errors).length === 0;
    }

    async function nextPage(e) {
        e.preventDefault();
        const ok = await checkPageFormikValidation(curPage);
        if (ok) setPage(curPage + 1);
    }

    function prevPage(e) {
        e.preventDefault();
        if (curPage > 0) setPage(curPage - 1);
    }

    async function goToPage(index) {
        if (index < curPage) setPage(index);
        else {
            const ok = await checkPageFormikValidation(curPage);
            if (ok) setPage(index);
        }
    }

    async function finish(e) {
        e.preventDefault();
        const ok = await checkPageFormikValidation(curPage);
        if (ok && onFinish) onFinish();
    }

    const classNames = () =>
        ["form-wizard", className].filter(Boolean).join(" ");

    return (
        <>
            {showProgress && (
                <Progress curPage={curPage} total={tabs.length} size={progressSize}>
                    <WizardNav
                        container={navContainer}
                        curPage={curPage}
                        pageChange={goToPage}
                        {...nav.props}
                    />
                </Progress>
            )}

            <Form
                className={classNames()}
                ref={formRef}
                noValidate
                validated={validated}
                onSubmit={(e) => e.preventDefault()}
            >
                {!showProgress && (
                    <WizardNav
                        container={navContainer}
                        curPage={curPage}
                        pageChange={goToPage}
                        {...nav.props}
                    />
                )}

                <Tabs
                    activeKey={curPage}
                    onSelect={(p) => setPage(Number(p))}
                >
                    {tabs.map((tab, index) => (
                        <Tab key={`wizard-${index}`} eventKey={index}>
                            {tab}
                        </Tab>
                    ))}
                </Tabs>
            </Form>

            <WizardPager
                container={pagerContainer}
                current={curPage}
                total={tabs.length}
                onNext={nextPage}
                onPrev={prevPage}
                onFinish={finish}
            />
        </>
    );
}
