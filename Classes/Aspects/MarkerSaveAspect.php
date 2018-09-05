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

namespace ObisConcept\NeosGmaps\Aspects;

use Neos\Flow\Annotations as Flow;
use Neos\Flow\Aop\JoinPointInterface;
use Neos\ContentRepository\Domain\Model\Node;

use ObisConcept\NeosGmaps\Utility\GeocodeConnector;

/**
 * An aspect for resolving and replacing address markers geodata before saving
 *
 * @Flow\Scope("singleton")
 * @Flow\Aspect
 */
class UnitLoginAspect
{
    protected const TARGET_NODE_TYPE = 'ObisConcept.NeosGmaps:GoogleMapMarker';

    protected const TARGET_NODE_PROPERTIES = ['street','zip','city','country'];

    /**
     * @Flow\Inject
     * @var GeocodeConnector
     */
    protected $geocodeService;

    /**
     * Checks if the changed node is a map marker, if so resolve and store geocoded data.
     *
     * @Flow\Before("method(Neos\ContentRepository\Domain\Model\Node->emitNodePropertyChanged())")
     * @param JoinPointInterface $joinPoint The current joinpoint
     * @return void
     */
    public function resolveAndStoreGeocodeDataForMarker(JoinPointInterface $joinPoint)
    {
        /** @var Node $node */
        $node = $joinPoint->getProxy();

        // Check if we got an address marker that can be processed
        if ($node->getNodeType()->getName() !== self::TARGET_NODE_TYPE) {
            return;
        }

        $modifiedProperty = $joinPoint->getMethodArgument('propertyName');

        // Check if one of the address-relevant properties has been changed
        if (array_search($modifiedProperty, self::TARGET_NODE_PROPERTIES) === false) {
            return;
        }

        // Collect current address data
        $street = $node->getProperty('street');
        $zip = $node->getProperty('zip');
        $city = $node->getProperty('city');
        $country = $node->getProperty('country');
        // ... and concatenate it
        $address = "$street, $zip $city, $country";

        // Resolve the corresponding geocoordinates from the GoogleMaps API
        $coordinates = $this->geocodeService->encode($address);

        // Store the retrieved data in the node for further rendering
        $node->setProperty('lat', $coordinates['latitude']);
        $node->setProperty('lng', $coordinates['longitude']);
    }
}
