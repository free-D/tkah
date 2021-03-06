import * as React from 'react';
interface TitleProps {
    component?: any[];
    title?: string;
}
export default class Home extends React.Component<TitleProps, any> {
    constructor(props: any) {
        super(props);
        this.state = {
            color: 'blue',
        };
    }
    render() {
        return (
            <div id='fixSelect'>
                {/*<div style={{*/}
                {/*    height: '60px',*/}
                {/*}}>*/}
                {/*    <div style={{*/}
                {/*        margin: '27px 0 0 54px',*/}
                {/*        width: '50%',*/}
                {/*        fontSize: 24,*/}
                {/*        fontWeight: 700,*/}
                {/*    }}>{this.props.title}</div>*/}
                {/*    <div>{this.props.moreButton}</div>*/}
                {/*</div>*/}
                <div style={{
                    minWidth: '900px',
                    padding: 15,
                    background: '#eee',
                    position: 'relative',
                    minHeight: '100%',
                }}>
                    {
                        this.props.component ? this.props.component.map((item: any, index: number) => {
                            return item ? <div key={index} style={{
                                padding: 15,
                                background: '#fff',
                                marginBottom: '15px',
                                minHeight: '100%',
                            }}>
                                {item}
                            </div> : null;
                        }) : <div style={{
                            padding: 15,
                            background: '#fff',
                            minHeight: '100%',
                        }}>
                            {this.props.children}
                        </div>
                    }
                </div>
            </div>
        );
    }

}
