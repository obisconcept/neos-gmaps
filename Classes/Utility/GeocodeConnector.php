<?php
/**
 * This file is part of the ObisConcept.NeosGmaps package.
 *
 * For the full copyright and license information, please
 * view the LICENSE file which was distributed with this
 * source code.
 *
 * @author Maximilian Schmidt <m.schmidt@obis-concept.de>
 * @copyright 2018 obis|CONCEPT GmbH & Co. KG
 * @license https://www.gnu.org/licenses/gpl-3.0.html GPL-3.0
 */

namespace ObisConcept\NeosGmaps\Utility;

use Neos\Flow\Annotations as Flow;

use Curl\Curl;
use ObisConcept\NeosGmaps\Exceptions\GeocodeRequestException;

class GeocodeConnector
{
    const GEOCODE_API_ENDPOINT = 'https://maps.googleapis.com/maps/api/geocode/json?key={KEY}&address={VALUE}';

    /**
     * @Flow\InjectConfiguration("apiKey")
     * @var string
     */
    protected $apiKey;

    /**
     * Encodes the given target address to geocoordinates.
     *
     * @param string $targetAddress The address to encode
     * @return array The encoded geocoordinates and additional information
     * @throws GeocodeRequestException
     */
    public function encode(string $targetAddress) : array
    {
        $request = new Curl();

        $targetUrl = $this->getEndpointUrl($targetAddress);

        $request->get($targetUrl);

        $response = $request->getRawResponse();
        $data = json_decode($response, true);

        $request->close();

        if ($data['status'] !== 'OK') {
            throw new GeocodeRequestException(
                "The given address '$targetAddress' could not be resolved to a proper set of geocoordinates!",
                1536224261,
                $this->resolveExceptionFromResponse($data)
            );
        }

        $geoData = $data['results'][0];

        return [
            'identifier' => $geoData['place_id'],
            'address' => $geoData['formatted_address'],
            'latitude' => $geoData['geometry']['location']['lat'],
            'longitude' => $geoData['geometry']['location']['lng']
        ];
    }

    public function decode(string $lat, string $lng) : string
    {
    }

    protected function getEndpointUrl(string $targetAddress) : string
    {
        $endpoint = self::GEOCODE_API_ENDPOINT;

        // Replace API key placeholder in endpoint URL
        $endpoint = str_replace('{KEY}', urlencode($this->apiKey), self::GEOCODE_API_ENDPOINT);
        // Replace adress placeholder in endpoint URL
        $endpoint = str_replace('{VALUE}', urlencode($targetAddress), $endpoint);

        return $endpoint;
    }

    /**
     * Resolves an exception object from the given response data if possible.
     *
     * @param array $data The response data
     * @return \Exception|null The resolved exception or null if no error occurred
     */
    protected function resolveExceptionFromResponse(array $data)
    {
        if ($data['status'] === 'ZERO_RESULTS') {
            $msg = 'The specified address does not exist.';
        } elseif ($data['status'] === 'OVER_DAILY_LIMIT') {
            $msg = 'Either the API key is missing, billing is not enabled on your account or the usage-quota has been exceeded!';
        } elseif ($data['status'] === 'OVER_QUERY_LIMIT') {
            $msg = 'You are over your quota!';
        } elseif ($data['status'] === 'REQUEST_DENIED') {
            $msg = 'Your request has been denied!';
        } elseif ($data['status'] === 'INVALID_REQUEST') {
            $msg = 'Your request is missing required arguments! Make sure you pass either an address, components or coordinates.';
        } elseif ($data['status'] === 'UNKNOWN_ERROR') {
            $msg = 'An internal server error has occurred! Try again in a few minutes.';
        }

        if (isset($msg)) {
            return new \Exception($msg, 1536225215);
        }

        return null;
    }
}
