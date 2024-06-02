import {Helmet} from 'react-helmet-async';

const Meta = ({title, description, keywords}) => {
    return <Helmet>
        <title>{title}</title>
        <meta name='description' content={description}></meta>
        <meta name='keywords' content={keywords}></meta>
    </Helmet>
}

Meta.defaultProps = {
    title: 'Welcome to Proshop',
    description: 'We sell the best products for cheap',
    keywords: 'electronics, bye electronics, cheap'
}

export default Meta;    