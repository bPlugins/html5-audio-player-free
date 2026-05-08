import { useState, useEffect } from 'react';

const useFetchStreamData = (streamUrl, nonce, intervalTime = 60000) => {
    const [streamData, setStreamData] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [source, setSource] = useState(streamUrl);

    // console.log({ source, nonce });


    const fetchStreamData = async () => {
        if (!source) return;
        setIsLoading(true);

        window.wp.ajax.send('h5ap_get_stream_data', {
            data: {
                url: source,
                nonce: nonce
            },
            success: (response) => {
                setStreamData(response);
                setIsLoading(false);
            },
            error: (response) => {
                setError(response);
                setIsLoading(false);
            }
        });


    }

    useEffect(() => {
        fetchStreamData();
        const interval = setInterval(() => {
            fetchStreamData();
        }, intervalTime);
        return () => {
            clearInterval(interval);
        }
    }, [source])

    return { streamData, setSource, fetchStreamData, isLoading, error }
}

export default useFetchStreamData;