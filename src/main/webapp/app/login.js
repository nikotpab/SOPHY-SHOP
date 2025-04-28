import React from 'react';
import {
    MDBContainer,
    MDBInput,
    MDBCheckbox,
    MDBBtn,
    MDBIcon
} from 'mdb-react-ui-kit';

window.onload = function App() {
    return React.createElement(
        MDBContainer,
        {
            className: "p-3 my-5 d-flex flex-column w-50"
        },
        [
            React.createElement(MDBInput, {
                wrapperClass: 'mb-4',
                label: 'Email address',
                id: 'form1',
                type: 'email',
                key: 'email'
            }),

            React.createElement(MDBInput, {
                wrapperClass: 'mb-4',
                label: 'Password',
                id: 'form2',
                type: 'password',
                key: 'password'
            }),

            React.createElement(
                'div',
                {
                    className: "d-flex justify-content-between mx-3 mb-4",
                    key: 'checkbox-container'
                },
                [
                    React.createElement(MDBCheckbox, {
                        name: 'flexCheck',
                        value: '',
                        id: 'flexCheckDefault',
                        label: 'Remember me',
                        key: 'checkbox'
                    }),
                    React.createElement('a', { href: "!#", key: 'link' }, 'Forgot password?')
                ]
            ),

            React.createElement(MDBBtn, { className: "mb-4", key: 'button' }, 'Sign in'),

            React.createElement(
                'div',
                {
                    className: "text-center",
                    key: 'footer'
                },
                [
                    React.createElement('p', { key: 'p1' }, 'Not a member? ', React.createElement('a', { href: "#!" }, 'Register')),
                    React.createElement('p', { key: 'p2' }, 'or sign up with:'),
                    React.createElement(
                        'div',
                        {
                            className: 'd-flex justify-content-between mx-auto',
                            style: { width: '40%' },
                            key: 'social-container'
                        },
                        [
                            React.createElement(MDBBtn, {
                                tag: 'a',
                                color: 'none',
                                className: 'm-1',
                                style: { color: '#1266f1' },
                                key: 'facebook'
                            }, React.createElement(MDBIcon, { fab: true, icon: 'facebook-f', size: "sm" })),

                            React.createElement(MDBBtn, {
                                tag: 'a',
                                color: 'none',
                                className: 'm-1',
                                style: { color: '#1266f1' },
                                key: 'twitter'
                            }, React.createElement(MDBIcon, { fab: true, icon: 'twitter', size: "sm" })),

                            React.createElement(MDBBtn, {
                                tag: 'a',
                                color: 'none',
                                className: 'm-1',
                                style: { color: '#1266f1' },
                                key: 'google'
                            }, React.createElement(MDBIcon, { fab: true, icon: 'google', size: "sm" })),

                            React.createElement(MDBBtn, {
                                tag: 'a',
                                color: 'none',
                                className: 'm-1',
                                style: { color: '#1266f1' },
                                key: 'github'
                            }, React.createElement(MDBIcon, { fab: true, icon: 'github', size: "sm" }))
                        ]
                    )
                ]
            )
        ]
    );
}

export default App;